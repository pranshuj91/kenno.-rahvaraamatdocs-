---
id: ci-cd
title: CI/CD & Git Workflow
sidebar_label: CI/CD & Git
---

# CI/CD & Git Workflow

## Git workflow (what the sources say)

- Single long-lived branch: `main`. CI runs on every pull request and push to `main`.
- Deploys only deploy a commit that is on `origin/main`; the server checkout must be on `main` and clean.
- Rollback = a revert commit on `main`, then deploy.
- The GA work (RR-262 to RR-270) went through PR #15 and PR #16, and a merge commit `4b71716`.
- The FE team's commits are in the same repo (`frontend/` is a git subtree; FE ADR-0008).
- Dependabot opens weekly PRs for Composer packages, actions and image patch releases (`.github/dependabot.yml`).

:::note[Not documented]
No branch naming convention, review rules or protected-branch settings for this repo are written in the sources. For the **e-shop** repo, the branches per ticket are listed in [E-shop Overview](./eshop-overview). The frontend has its own commit rules in `frontend/CONTRIBUTING.md` (a `commit-msg` hook enforces them).
:::

## CI (`.github/workflows/ci.yml`)

- Runs on `ubuntu-24.04`, timeout 20 min, one run per ref (older runs cancelled).
- Writes a throwaway `.env` (random DB and key values, `GEMINI_API_KEY=ci-mock`, `OPENAI_API_KEY=ci-mock`).
- Runs `bin/ci`: starts an empty stack, loads the small catalogue `tests/fixtures/catalog.sql`, builds the index, then checks code style (`composer cs`, PER-CS), PHPStan level 6 (`composer stan`), `composer audit` and `bin/test`.
- `bin/ci` refuses to run on a database that already has products.
- On failure, container logs are printed.

## Frontend CI (`.github/workflows/frontend.yml`)

`npm run verify` plus a Docker build.

## Deploy workflow (`.github/workflows/deploy.yml`)

- **Staging:** every push to `main`, once CI has passed on that commit.
- **Production:** by hand: Actions, Deploy, Run workflow, `production`, from `main` only. The `production` environment's required reviewers approve first.
- It connects over SSH; the key can only run `bin/deploy.sh` with the commit it sends (forced command). One deploy per environment at a time.
- Until an environment has its secrets, pushes to `main` skip the deploy with a warning.

### One-time setup per server and GitHub environment (`staging`, `production`)

1. On the server, as the user that owns the checkout (in the `docker` group, checkout on `main`, able to `git fetch` from GitHub): `ssh-keygen -t ed25519 -N '' -f deploy_key`, then add the public key to `~/.ssh/authorized_keys` with a forced command:

```text
restrict,command="/path/to/kingisoovitaja/bin/deploy.sh" ssh-ed25519 AAAA... github-deploy
```

2. In GitHub, Settings, Environments, add secrets `DEPLOY_SSH_KEY` (private key), `DEPLOY_KNOWN_HOSTS` (`ssh-keyscan -t ed25519 HOST`, checked against the server's `/etc/ssh/ssh_host_ed25519_key.pub`) and `DEPLOY_TARGET` (`user@host`). Delete the private key from the server afterwards.
3. For `production`, add required reviewers and allow only the `main` branch.

**Current state:** the `DEPLOY_*` secrets are still an open item, so deploys are done by hand on the server. A read-only deploy key was added on the server and its public key given to Kenno.

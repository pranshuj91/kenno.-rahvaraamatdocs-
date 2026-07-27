---
id: REGISTRATION_FLOW
title: Registration Flow
sidebar_label: Registration Flow
---
### Registration and Account Lifecycle Flow

This document describes, in detail, how registration, email verification, password reset, and social authentication work through the AuthController endpoints. It ties the HTTP calls to the underlying forms/handlers and explains expected inputs, side‑effects, and typical responses.

Overview of endpoints (Auth)
- POST /auth/register — register a simple client account (mobile scenario).
- POST /auth/register-simple — register a simple client account (web scenario).
- POST /auth/register-business — register a business account.
- POST /auth/register-wholesale — register a wholesale account.
- POST /auth/verify-email?verificationToken=... — complete email verification and set password; issues an access token on success.
- GET  /auth/verify-email-meta?verificationToken=... — fetch metadata for the email verification page.
- POST /auth/reset-password — start password reset flow (sends reset mail).
- POST /auth/set-new-password?passwordResetToken=... — set a new password using token from email.
- GET|POST /auth/external — handle social registration/attach (Google/Facebook/Apple) via redirect-based flow.
- POST /auth/social-login — complete social login by role after external step.
- POST /auth/login — non-social login (listed here for context as it returns token + basket).
- POST /auth/switch-web-store — exchange token for the same user in another web store (requires bearer).

Cross-cutting behaviors
- Header store (web store NAV code) is required for most actions: store: WEB or WEB2.
- Language header x-app-language can be passed; BaseController sets action-time response header.
- Many actions return validation models with 422 on invalid input; successful flows often return 200 with either an empty object or a small payload.
- Authentication is optional for most registration-related actions; switch-web-store requires a bearer token.

1) Simple customer registration

A) Mobile-oriented: POST /auth/register
- Code path: AuthController::actionRegister()
  - Builds api\models\forms\registration\SimpleClientRegisterForm.
  - Sets scenario SCENARIO_MOBILE_REGISTRATION, sets current WebStore, loads POST JSON.
  - If validate() and submit() succeeds, returns the form (with no errors). On unexpected failure, 500 ServerErrorHttpException.
- What submit() does (high level):
  - Creates or reuses a User; binds/creates ClientAccount of simple type for current WebStore.
  - Sends a verification email with a link to the front-end where the user will set their password and confirm email.
- Email-in-use rules (from controller docs):
  - If email exists but the user is not activated: resend the verification mail.
  - If email exists for a user without a simple client account: continue registration (create missing account binding) and send verification.
  - If email exists for a user who already has a simple account in the same store: return success without sending verification again.
  - If email exists for a user with a simple account in another store: send an email explaining they can log in with credentials from the other store.

B) Web-oriented: POST /auth/register-simple
- Code path: AuthController::actionRegisterSimple()
  - Same form as above (SimpleClientRegisterForm) but without the mobile scenario; sets WebStore and loads POST JSON.
  - validate() + submit() and error handling mirror the mobile path.
- Outcome is identical to /auth/register regarding email logic and persistence.

2) Business customer registration

- Endpoint: POST /auth/register-business
- Code path: AuthController::actionRegisterBusiness()
  - Uses api\models\forms\registration\BusinessClientRegistrationForm and CompanyClientRegistrationFormHandler.
  - Flow: load POST -> if validate(): handler->setWebStore(current) -> handler->submit(form).
  - On failure without form errors, throws 500; otherwise returns the form (with errors or success state).
- Side-effects:
  - Creates a Company and associated ClientAccount for the business user in the current WebStore.
  - Triggers any internal notifications configured in the handler (e.g., to back office) — see handler implementation for details.

3) Wholesale customer registration

- Endpoint: POST /auth/register-wholesale
- Code path: AuthController::actionRegisterWholesale()
  - Uses api\models\forms\registration\WholesaleClientRegistrationForm.
  - Validates a comprehensive payload (company and contact data) and persists a wholesale registration record.
  - Error handling mirrors other registration actions.
- Side-effects:
  - Creates a wholesale-oriented Company/ClientAccount request; activation/approval may include back-office steps (see form/handler).

4) Email verification: pre-flight metadata

- Endpoint: GET /auth/verify-email-meta?verificationToken=...
- Code path: AuthController::actionVerifyEmailMeta()
  - Looks up a User by verification_token and ensures activationClientAccount exists.
  - Returns api\serializers\UserSerializer on success; 400 BadRequest if not found or if activation data is inconsistent.
- Use case: Front-end fetches the user/account info needed to render a password-setting/verification page before submitting the actual verification.

5) Email verification: complete verification and activate

- Endpoint: POST /auth/verify-email?verificationToken=...
- Code path: AuthController::actionVerifyEmail()
  - Builds api\models\forms\VerifiedEmailForm, assigns User and activation ClientAccount, sets WebStore, loads POST data (typically includes password fields and consents required by the form).
  - If validate():
    - submit() activates the account, confirms the email, and finalizes password.
    - Pushes FacebookConversionsTrackCompleteRegistrationEventJob to the queue (with action-time and WebStore context) for marketing analytics.
    - Returns: \{ accessToken, webStoreNavCode \} — immediate login for the newly verified user.
  - On invalid input: returns the form with validation errors (422 semantics in REST clients).
  - On missing/invalid token or mismatched activation context: 400 Bad Request.

6) Password reset: request

- Endpoint: POST /auth/reset-password
- Code path: AuthController::actionResetPassword()
  - Uses api\models\forms\PasswordResetForm; sets WebStore; loads bodyParams and validates email.
  - On success: form->submit(); sends an email with passwordResetToken; returns an empty JSON object {} (200).
  - If the email does not exist, still returns success (no-disclosure policy).
  - Errors: 422 for validation; 500 if persistence fails unexpectedly.

7) Password reset: set a new password

- Endpoint: POST /auth/set-new-password?passwordResetToken=...
- Code path: AuthController::actionSetNewPassword()
  - Finds the User by passwordResetToken; 400 if not found.
  - Loads api\models\forms\NewPasswordForm with the User; on validate(): submit() persists the new password and clears the token; returns {} (200).
  - Errors: 422 for invalid new password input; 500 if DB save fails.

8) Social registration and linking

A) Redirect-handled entry: GET|POST /auth/external
- Code path: AuthController::actions()['external'] using common\components\auth\AuthAction.
  - successCallback => AuthController::onAuthSuccess($client)
- High level behavior:
  - Initiates or handles the return step from Google/Facebook/Apple.
  - Supports linking a social auth method to an existing account when Authorization bearer is supplied.
  - Apple-specific params (client, id, token) can be passed in query per annotations.

B) Completing role-specific login: POST /auth/social-login
- Code path: AuthController::actionSocialLogin()
  - Expects authId (reference to common\models\Auth created in the external flow), role, and isNativeForm flag.
  - Resolves the auth client via yii\authclient\Collection (e.g., google, facebook).
  - Delegates to common\components\auth\AuthHandler->loginWithRole($auth, $role, $isNativeForm), which returns a token payload.
- Response: \{ accessToken \} and possibly additional data depending on the handler implementation.

9) Classic login (context)

- Endpoint: POST /auth/login
- Code path: AuthController::actionLogin()
  - Uses api\models\forms\LoginForm; sets WebStore, loads POST.
  - If multiple roles are available and none chosen: returns \{ roles: [...] \} for the UI to select.
  - If a role is provided (or only one role): model->login() and returns \{ accessToken, basket \}.

10) Switch web store (post-registration convenience)

- Endpoint: POST /auth/switch-web-store
- Code path: AuthController::actionSwitchWebStore()
  - Requires Authorization: Bearer `<token>`.
  - Validates provided webStoreNavCode, checks customer type constraints (retail-only restriction), and calls ClientAccount->afterLogin($webStore).
  - Returns a newly issued token for the same user under the selected WebStore: \{ accessToken \}.
  - Error cases: 422 Unprocessable when already under the same store or wrong store/customer type; 400 for bad input in other contexts.

Security and UX notes
- Tokens: On successful verification (/verify-email) a bearer token is issued immediately to smooth onboarding.
- Non-disclosure: Reset password request does not disclose whether an email exists.
- Role selection: Both login and social-login flows can require explicit role selection when an identity has multiple account types.
- Web store context: Almost all flows are scoped to a WebStore; pass store: WEB | WEB2 header and use /auth/switch-web-store to reissue tokens if needed.

Troubleshooting tips
- 400 on verification or set-new-password usually means an invalid/expired token or inconsistent activation context.
- 422 responses include field-level validation errors from the forms mentioned above.
- For social auth issues, inspect logs around AuthAction and AuthHandler, and verify that the authClientCollection is configured with the provider in use.


## See also
- ../commerce-ordering/ORDER_PURCHASE_FLOW.md — where registration ties into checkout/login
- ../reference/ADMIN_MODULE.md — admin views for user/accounts management




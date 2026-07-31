const fs = require('fs');
const path = require('path');
const root = process.cwd();

function stripFrontmatter(text) {
  if (!text.startsWith('---')) return text;
  const end = text.indexOf('\n---', 3);
  if (end === -1) return text;
  return text.slice(end + 4).replace(/^\r?\n/, '');
}

function rewriteLinks(body, sourceRel) {
  const dir = path.posix.dirname(sourceRel.replace(/\\/g, '/'));
  const docsPrefix = '/' + dir.replace(/^docs\//, 'docs/');
  return body
    .replace(/\]\(\.\/([^)]+)\.md\)/g, `](/${dir}/$1)`)
    .replace(/\]\(\.\.\/deployment\/([^)]+)\.md\)/g, '](/docs/deployment/$1)')
    .replace(/\]\(\.\.\/infrastructure\/([^)]+)\.md\)/g, '](/docs/infrastructure/$1)');
}

function buildGap({ outRel, id, title, sidebar, meta, sources }) {
  const parts = [
    '---',
    `id: ${id}`,
    `title: ${title}`,
    `sidebar_label: ${sidebar}`,
    '---',
    '',
    `# ${title}`,
    '',
    '| Field | Value |',
    '|---|---|',
    '| Priority | Infrastructure |',
    '| Category | Infrastructure |',
    `| Gap item | ${meta.gapItem} |`,
    `| Description | ${meta.description} |`,
    '| Documentation status | Documented |',
    `| Code location | ${meta.codeLocation} |`,
    '| Assigned to | — |',
    '',
    '## Related Developer Docs',
    '',
  ];
  for (const s of sources) parts.push(`- \`${s}\``);
  parts.push(
    '',
    '## Documentation',
    '',
    '> This topic was added to Developer Docs and is shown here so the team can review the documented coverage for this gap in one place.',
    ''
  );
  for (const s of sources) {
    const abs = path.join(root, s);
    if (!fs.existsSync(abs)) {
      console.error('Missing', abs);
      process.exit(1);
    }
    let body = stripFrontmatter(fs.readFileSync(abs, 'utf8')).trimEnd();
    body = rewriteLinks(body, s);
    parts.push('', '---', '', `### Developer Docs — \`${s}\``, '', body, '');
  }
  const out = path.join(root, outRel);
  fs.writeFileSync(out, parts.join('\n') + '\n');
  console.log('Wrote', outRel);
}

buildGap({
  outRel: 'gap-docs/infrastructure/IN-001-ssl-certificate.md',
  id: 'IN-001-ssl-certificate',
  title: 'IN-001 — SSL Certificate Management',
  sidebar: 'IN-001 SSL Certificates',
  meta: {
    gapItem: 'SSL Certificate Management',
    description:
      'Certificate renewal, web server SSL configuration — handled at server/infrastructure level',
    codeLocation: 'Outside codebase',
  },
  sources: [
    'docs/infrastructure/IN-001-SSL-CERTIFICATE-MANAGEMENT.md',
    'docs/infrastructure/IN-001-SSL-CERTIFICATE-MANAGEMENT-STAGING.md',
  ],
});

buildGap({
  outRel: 'gap-docs/infrastructure/IN-002-pm2-process.md',
  id: 'IN-002-pm2-process',
  title: 'IN-002 — PM2 Process Management',
  sidebar: 'IN-002 PM2 Process',
  meta: {
    gapItem: 'PM2 Process Management',
    description: 'Node process manager configuration, restart policies, logging',
    codeLocation: 'Outside codebase / server',
  },
  sources: [
    'docs/infrastructure/IN-002-PM2-PROCESS-MANAGEMENT.md',
    'docs/infrastructure/IN-002-PM2-PROCESS-MANAGEMENT-STAGING.md',
  ],
});

buildGap({
  outRel: 'gap-docs/infrastructure/IN-005-server-architecture.md',
  id: 'IN-005-server-architecture',
  title: 'IN-005 — Server Architecture',
  sidebar: 'IN-005 Server Architecture',
  meta: {
    gapItem: 'Server Architecture',
    description: 'Production server setup, load balancing, CDN — infrastructure diagram',
    codeLocation: 'TBD',
  },
  sources: [
    'docs/infrastructure/IN-005-PRODUCTION-SERVER-ARCHITECTURE.md',
    'docs/infrastructure/IN-005-STAGING-SERVER-ARCHITECTURE.md',
    'docs/infrastructure/INFRASTRUCTURE_OVERVIEW.md',
  ],
});

buildGap({
  outRel: 'gap-docs/infrastructure/IN-006-monitoring-alerting.md',
  id: 'IN-006-monitoring-alerting',
  title: 'IN-006 — Monitoring & Alerting',
  sidebar: 'IN-006 Monitoring & Alerting',
  meta: {
    gapItem: 'Monitoring & Alerting',
    description: 'Server monitoring, error alerts, uptime checks — tools and configuration',
    codeLocation: 'TBD',
  },
  sources: [
    'docs/infrastructure/IN-006-MONITORING-ALERTING.md',
    'docs/infrastructure/IN-006-MONITORING-ALERTING-STAGING.md',
    'docs/monitoring/12-MONITORING_LOGGING.md',
  ],
});

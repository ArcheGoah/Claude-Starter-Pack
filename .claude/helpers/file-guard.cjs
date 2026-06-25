#!/usr/bin/env node
/**
 * PreToolUse Hook: Blocks edits to sensitive files.
 * Exit code 2 = block the tool call.
 */
let data = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => { data += c; });

setTimeout(() => {
  try {
    const input = JSON.parse(data);
    const fp = (input.tool_input && input.tool_input.file_path) || '';
    const base = require('path').basename(fp).toLowerCase();
    const dir = fp.replace(/\\/g, '/').toLowerCase();

    const blocked = [
      '.env', '.env.local', '.env.production', '.env.development',
      'cookies.txt', 'credentials.json', '.npmrc',
      'id_rsa', 'id_ed25519', '.pem', '.key', '.secret'
    ];

    let isBlocked = false;
    for (const pattern of blocked) {
      if (base === pattern || base.endsWith(pattern) ||
          dir.includes('/secrets/') || dir.includes('/.ssh/')) {
        isBlocked = true;
        break;
      }
    }

    if (isBlocked) {
      console.error('BLOCKED: Editing ' + base + ' is forbidden. Ask the project owner to edit manually.');
      process.exit(2);
    }
  } catch (e) { /* allow on parse error */ }
  process.exit(0);
}, 400);

process.stdin.resume();

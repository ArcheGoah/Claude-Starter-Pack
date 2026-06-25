#!/usr/bin/env node
/**
 * Session Handoff Loader
 * Reads .claude/HANDOFF.md at session start and injects into context.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const HANDOFF = path.join(ROOT, '.claude', 'HANDOFF.md');

if (fs.existsSync(HANDOFF)) {
  const content = fs.readFileSync(HANDOFF, 'utf-8');

  // Check staleness (>24h)
  try {
    const match = content.match(/Last updated: (.+)/);
    if (match) {
      const age = (Date.now() - new Date(match[1]).getTime()) / 3600000;
      if (age > 24) {
        console.log('[HANDOFF] Previous handoff is ' + Math.round(age) + 'h old (stale). Starting fresh.');
        process.exit(0);
      }
    }
  } catch {}

  console.log('=== SESSION CONTINUITY: Previous Session Handoff ===');
  console.log(content);
  console.log('=== END HANDOFF ===');
  console.log('Review the handoff above. If IN_PROGRESS, continue from Next Steps.');
} else {
  console.log('[HANDOFF] No previous handoff found. Starting fresh.');
}

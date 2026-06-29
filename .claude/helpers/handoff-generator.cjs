#!/usr/bin/env node
/**
 * Session Handoff Generator
 * Creates .claude/HANDOFF.md at session end for continuity.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..', '..');
const HANDOFF = path.join(ROOT, '.claude', 'HANDOFF.md');
const SESSION_FILE = path.join(ROOT, '.claude-state', 'sessions', 'current.json');
const PENDING = path.join(ROOT, '.claude-state', 'data', 'pending-insights.jsonl');

function exec(cmd) {
  try { return execSync(cmd, { cwd: ROOT, encoding: 'utf-8', timeout: 5000, windowsHide: true }).trim(); }
  catch { return ''; }
}

function getEditedFiles() {
  if (!fs.existsSync(PENDING)) return [];
  try {
    const files = new Set();
    for (const line of fs.readFileSync(PENDING, 'utf-8').trim().split('\n').filter(Boolean)) {
      try { const e = JSON.parse(line); if (e.file) files.add(e.file); } catch {}
    }
    return [...files];
  } catch { return []; }
}

const branch = exec('git branch --show-current');
const lastCommit = exec('git log -1 --oneline');
const statusRaw = exec('git status --porcelain');
const changedFiles = statusRaw ? statusRaw.split('\n').length : 0;
const editedFiles = getEditedFiles();
const now = new Date().toISOString();

let session = null;
try { if (fs.existsSync(SESSION_FILE)) session = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf-8')); } catch {}
const sessionId = session ? session.id : 'session-' + Date.now();
const metrics = session ? (session.metrics || {}) : {};

const filesSection = editedFiles.length > 0
  ? editedFiles.map(f => '- `' + f + '`').join('\n')
  : '- No files tracked';

const handoff = `# Session Handoff

> Auto-generated at session end. Do NOT edit manually.
> Last updated: ${now}
> Session ID: ${sessionId}
> Metrics: ${metrics.edits || 0} edits, ${metrics.tasks || 0} tasks

## Active Task
{To be filled by Claude before compaction}

## Status
IN_PROGRESS

## What Was Done This Session
{To be filled by Claude before compaction}

## Files Modified
${filesSection}

## Next Steps
1. {To be determined}

## Context Snapshot
- Branch: ${branch || 'unknown'}
- Last commit: ${lastCommit || 'none'}
- Uncommitted changes: ${changedFiles > 0 ? 'YES' : 'NO'} (${changedFiles} files)
`;

fs.writeFileSync(HANDOFF, handoff, 'utf-8');
console.log('[HANDOFF] Generated: ' + HANDOFF);

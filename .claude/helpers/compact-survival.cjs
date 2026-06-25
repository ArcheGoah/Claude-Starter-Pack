#!/usr/bin/env node
/**
 * PostCompact Hook: Re-injects critical rules after context compaction.
 * Reads CLAUDE.md and .claude/rules/ to extract key rules.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.env.CLAUDE_PROJECT_DIR || path.join(__dirname, '..', '..');
const CLAUDE_MD = path.join(ROOT, 'CLAUDE.md');
const RULES_DIR = path.join(ROOT, '.claude', 'rules');

function extractCritical() {
  const parts = [];

  // Extract from CLAUDE.md
  try {
    const md = fs.readFileSync(CLAUDE_MD, 'utf-8');
    const sections = ['Arbeitsregeln', 'Datei-Regeln', 'Dringende Hinweise'];
    for (const section of sections) {
      const regex = new RegExp(`## (?:IMPORTANT: )?${section}[\\s\\S]*?(?=\\n---\\n|\\n## |$)`);
      const match = md.match(regex);
      if (match) parts.push(match[0].substring(0, 500));
    }
  } catch (e) { /* non-fatal */ }

  // Extract key rules from .claude/rules/feedback.md
  try {
    const feedback = fs.readFileSync(path.join(RULES_DIR, 'feedback.md'), 'utf-8');
    const lines = feedback.split('\n').filter(l => l.match(/^\d+\./)).slice(0, 8);
    if (lines.length) parts.push('Feedback-Regeln:\n' + lines.join('\n'));
  } catch (e) { /* non-fatal */ }

  return parts.join('\n\n').substring(0, 3000);
}

try {
  const critical = extractCritical();
  if (critical) {
    console.log(JSON.stringify({
      systemMessage: 'CONTEXT RESTORED AFTER COMPACTION.\n\n' + critical +
        '\n\nYOU MUST re-read CLAUDE.md and .claude/rules/ now if needed.'
    }));
  }
} catch (e) {
  // Non-fatal — compaction continues regardless
}

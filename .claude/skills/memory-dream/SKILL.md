---
name: memory-dream
description: Memory hygiene and maintenance - merge duplicates, resolve contradictions, update stale info, compress index, optimize CLAUDE.md
triggers:
  - memory dream
  - memory aufraeumen
  - memory cleanup
  - dream
  - aufraeumen
  - deduplizieren
---

# Memory Dream - Memory Hygiene & Maintenance

Inspired by Claude Code's /dream command. Automatically cleans, optimizes, and maintains the memory system and CLAUDE.md.

## When to use
- Memory index (MEMORY.md) approaching 200 lines
- Suspected duplicate or contradictory memories
- After intensive sessions with many new memories
- Regular maintenance (recommended: weekly)
- User says "aufraeumen", "dream", "memory cleanup"

## Pipeline

### Step 1: Audit Memory Index
Read the MEMORY.md index file. Check:
- Total line count (warn if >150, critical if >200)
- Broken links (files referenced but don't exist)
- Orphan files (exist in memory/ but not in MEMORY.md)

### Step 2: Read All Memory Files
Read every .md file in the memory directory. For each check:
- **Duplicates**: Two files covering the same topic
- **Contradictions**: Conflicting information between files
- **Stale info**: Relative dates ("next week", "soon"), outdated facts
- **Too vague**: Memories that don't provide actionable context

### Step 3: Merge Duplicates
If two files cover the same topic:
1. Merge content into the more comprehensive file
2. Delete the redundant file
3. Update MEMORY.md index

### Step 4: Resolve Contradictions
If files contradict each other:
1. Check which is more recent
2. Verify against current codebase state
3. Keep accurate version, update or remove the other

### Step 5: Update Stale Info
- Convert relative dates to absolute dates
- Check if referenced files/features still exist
- Update project status if changed
- Remove completed/irrelevant project memories

### Step 6: Compress Index
Ensure MEMORY.md stays concise:
- Each entry max ~150 characters
- Group by type (User, Feedback, Project, Reference)
- Remove entries for deleted memory files
- Alphabetize within groups

### Step 7: Audit CLAUDE.md
Check CLAUDE.md:
- Project structure matches actual filesystem
- Skill count is accurate
- Links and references still valid
- No outdated information

### Step 8: Report
```
## Memory Dream Report
- Files audited: X
- Duplicates merged: X
- Contradictions resolved: X
- Stale entries updated: X
- Orphan files cleaned: X
- MEMORY.md lines: X/200
- CLAUDE.md issues found: X
```

## Auto-Fire Rules
- After any session that creates 3+ new memories
- User says "aufraeumen" or "dream"
- MEMORY.md exceeds 150 lines

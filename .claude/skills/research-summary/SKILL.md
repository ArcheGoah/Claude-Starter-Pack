# Research Summary - Meta-Analysis Generator

You are **Research Summary**, a skill that analyzes all imported video reports and generates a comprehensive research document.

**Input:** `$ARGUMENTS` is optional. If provided, it's a focus topic to filter/weight the analysis (e.g., "mural techniques", "gallery pitching", "art business").

---

## Process

1. Read all files in `video-imports/` directory
2. Extract and cross-reference:
   - Art techniques and processes documented
   - Tools, software, and materials referenced
   - Business strategies and pricing approaches
   - Gallery/festival/magazine opportunities mentioned
   - Content creation workflows
   - Marketing and branding insights
   - Contacts and networking opportunities
3. Generate a comprehensive research summary

### Output

Save to `research/meta_analysis_{YYYY-MM-DD}.md`:

```markdown
# Art Business Research — Meta-Analysis

**Videos analyzed:** [count]
**Date range:** [earliest to latest import]
**Generated:** [date]
**Focus:** [topic if specified, otherwise "General"]

---

## Executive Summary

[3-5 sentences summarizing key findings across all analyzed content]

## Technique & Process Insights

### Painting & Murals
[Techniques documented, materials, approaches]

### Sculpture & Installation
[3D techniques, materials, scale considerations]

### Digital & Video Mapping
[Software workflows, projection mapping setups, digital tools]

### Content Creation
[How other artists create and distribute content]

## Business & Strategy

### Pricing Approaches
[How artists price work, commission structures]

### Gallery Relationships
[How to approach galleries, what they look for]

### Festival Applications
[Application strategies, what makes successful applications]

### Marketing & Branding
[Social media strategies, personal branding approaches]

## Tools & Resources

[All tools, software, services, and platforms mentioned across videos]

## Opportunities Identified

[Any specific galleries, festivals, residencies, or contacts discovered]

## Applicable to {DEIN_NAME}

[Based on all research, what are the top 5 actionable insights for {User}'s specific practice and business goals?]

## Knowledge Gaps

[What questions remain unanswered? What should we research next?]
```

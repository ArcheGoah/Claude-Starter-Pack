# Batch Import - Process Multiple Videos

You are **Batch Import**, a skill that processes multiple video URLs sequentially and generates a summary report.

**Input:** `$ARGUMENTS` is either:
- A path to a text file with one URL per line
- Multiple URLs separated by spaces or newlines pasted directly

---

## Process

1. Parse all URLs from the input
2. For each URL, execute the `/video-import` skill pipeline
3. After all videos are processed, generate a meta-analysis

### Meta-Analysis Report

Save to `research/batch_summary_{YYYY-MM-DD}.md`:

```markdown
# Batch Import Summary — [Date]

**Videos processed:** [count]
**Platforms:** [breakdown]

## Common Themes & Insights

[What themes, techniques, or strategies appear across multiple videos?]

## Unique Insights per Video

[1-2 line summary of each video's unique contribution]

## Art Business Relevance

### Techniques & Methods Ranked by Frequency
[Which techniques or approaches are mentioned most often?]

### Tools & Software Mentioned
[Comprehensive list across all videos]

### Contacts & Opportunities
[Any galleries, festivals, curators, or artists mentioned]

### Content Repurpose Potential
[Which videos contain material that could be repurposed for {User}'s content pipeline?]

### Recommended Next Steps
[Prioritized action items based on all videos analyzed]
```

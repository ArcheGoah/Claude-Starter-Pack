---
name: notion-content-pipeline
description: Manages {User}'s Content Pipeline Notion DB. Creates DB schema if missing, schedules posts, tracks engagement, and auto-syncs from reel-template/carousel/instagram-caption-generator skills. TRIGGER on "content pipeline", "save to notion", "schedule post", "content kalender", "post planen", "draft reel", "draft carousel", "trackt engagement", "content db".
auto_fire: true
triggers:
  - content pipeline
  - save to notion
  - schedule post
  - content kalender
  - post planen
  - draft reel
  - draft carousel
  - track engagement
  - content db
related_skills:
  - reel-template
  - carousel
  - instagram-caption-generator
  - comment-gate-reel
  - tool-list-reel
  - process-as-content-reel
---

# Notion Content Pipeline Skill

Single source of truth fuer ALLEN Content den {User} plant, draftet, postet und tracked.
Schliesst die Luecke zwischen Content-Generierung (reel-template, carousel, etc.) und
tatsaechlicher Veroeffentlichung + Performance-Tracking.

## Status: NEU (Notion DB existiert noch NICHT)

Bei Trigger erstmalig:
1. Pruefe ob `content_pipeline` Key in `config/notion.json` existiert
2. Falls NEIN -> fuehre `scripts/create_content_pipeline_db.py` aus (siehe unten)
3. Update `config/notion.json` mit neuer DB ID
4. Update `docs/notion/notion-database-ids.md`

## DB Schema (13 Felder)

| Feld | Typ | Optionen / Beschreibung |
|------|-----|-------------------------|
| **Title** | title | Working Title des Posts (z.B. "5 AI Tools fuer Murals") |
| **Format** | select | Reel \| Carousel \| Single Image \| Story \| Video Long \| Thread \| Blog |
| **Niche** | multi_select | Art \| Motion \| Art Series \| Music ({DEIN_PROJEKT}) \| Mural \| Behind-the-Scenes \| Tutorial \| Tools \| Process |
| **Hook** | rich_text | Erste 3 Sekunden / erste Zeile (CTA-getrieben, max 80 Zeichen) |
| **Script** | rich_text | Vollstaendiges Script / Carousel-Slides / Caption-Body |
| **Status** | status | Idea \| Draft \| Review \| Scheduled \| Posted \| Archived |
| **Platform** | multi_select | Instagram \| TikTok \| YouTube Shorts \| Threads \| LinkedIn \| Twitter/X \| Behance |
| **Hashtags** | rich_text | 3-5 fokussierte Hashtags (Caption-SEO, kein Spam) |
| **CTA** | select | Comment-Gate \| Save \| Share \| DM \| Link in Bio \| Follow \| Question \| None |
| **Expected Engagement** | number | Erwartete Likes (basierend auf 90-Tage-Median + Format-Multiplier) |
| **Actual Engagement** | number | Tatsaechliche Likes nach 7 Tagen (manuell nachtragen) |
| **Source Format** | select | Original \| Chase Format \| Sabum Format \| Comment-Gate \| Tool List \| Process Reel \| AI Generated |
| **AI Disclosure** | select | None \| AI-Assisted \| Fully AI \| AI-Tool-Showcase (PFLICHT bei AI-Content!) |

Zusatzfelder:
- **Schedule Date** (date)
- **Posted Date** (date)
- **Source Skill** (select): reel-template / carousel / instagram-caption-generator / etc.
- **Notes** (rich_text)
- **Asset Path** (rich_text): Pfad zu Video/Image im Media-Ordner
- **URL** (url): Live Post URL nach Publish

## DB Creation Script

Datei: `scripts/create_content_pipeline_db.py`

```python
"""
Create Content Pipeline Database in Notion.
Run ONCE. Updates config/notion.json + docs/notion/notion-database-ids.md.
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT))

from src.shared import notion_client as nc
import requests

# 1. Find a parent page (use workspace search to pick a parent)
def find_parent_page():
    """Find a workspace page to nest the DB under."""
    results = nc.search(query="Content", filter_type="page")
    if results:
        return results[0]["id"]
    # fallback: any page
    results = nc.search(filter_type="page")
    if not results:
        raise RuntimeError("No pages found in workspace. Create one first.")
    return results[0]["id"]


def create_db():
    parent_id = find_parent_page()

    schema = {
        "parent": {"type": "page_id", "page_id": parent_id},
        "icon": {"type": "emoji", "emoji": "M"},
        "title": [{"type": "text", "text": {"content": "Content Pipeline"}}],
        "properties": {
            "Title": {"title": {}},
            "Format": {
                "select": {
                    "options": [
                        {"name": "Reel", "color": "pink"},
                        {"name": "Carousel", "color": "purple"},
                        {"name": "Single Image", "color": "blue"},
                        {"name": "Story", "color": "yellow"},
                        {"name": "Video Long", "color": "red"},
                        {"name": "Thread", "color": "gray"},
                        {"name": "Blog", "color": "green"},
                    ]
                }
            },
            "Niche": {
                "multi_select": {
                    "options": [
                        {"name": "Art", "color": "purple"},
                        {"name": "Motion", "color": "blue"},
                        {"name": "Art Series", "color": "orange"},
                        {"name": "Music ({DEIN_PROJEKT})", "color": "pink"},
                        {"name": "Mural", "color": "red"},
                        {"name": "Behind-the-Scenes", "color": "yellow"},
                        {"name": "Tutorial", "color": "green"},
                        {"name": "Tools", "color": "gray"},
                        {"name": "Process", "color": "brown"},
                    ]
                }
            },
            "Hook": {"rich_text": {}},
            "Script": {"rich_text": {}},
            "Status": {
                "status": {}  # Notion auto-creates default Idea/Draft/Review/etc.
            },
            "Platform": {
                "multi_select": {
                    "options": [
                        {"name": "Instagram", "color": "pink"},
                        {"name": "TikTok", "color": "default"},
                        {"name": "YouTube Shorts", "color": "red"},
                        {"name": "Threads", "color": "gray"},
                        {"name": "LinkedIn", "color": "blue"},
                        {"name": "Twitter/X", "color": "default"},
                        {"name": "Behance", "color": "blue"},
                    ]
                }
            },
            "Hashtags": {"rich_text": {}},
            "CTA": {
                "select": {
                    "options": [
                        {"name": "Comment-Gate", "color": "pink"},
                        {"name": "Save", "color": "yellow"},
                        {"name": "Share", "color": "blue"},
                        {"name": "DM", "color": "purple"},
                        {"name": "Link in Bio", "color": "green"},
                        {"name": "Follow", "color": "orange"},
                        {"name": "Question", "color": "gray"},
                        {"name": "None", "color": "default"},
                    ]
                }
            },
            "Expected Engagement": {"number": {"format": "number"}},
            "Actual Engagement": {"number": {"format": "number"}},
            "Source Format": {
                "select": {
                    "options": [
                        {"name": "Original", "color": "default"},
                        {"name": "Chase Format", "color": "blue"},
                        {"name": "Sabum Format", "color": "purple"},
                        {"name": "Comment-Gate", "color": "pink"},
                        {"name": "Tool List", "color": "gray"},
                        {"name": "Process Reel", "color": "brown"},
                        {"name": "AI Generated", "color": "orange"},
                    ]
                }
            },
            "AI Disclosure": {
                "select": {
                    "options": [
                        {"name": "None", "color": "gray"},
                        {"name": "AI-Assisted", "color": "yellow"},
                        {"name": "Fully AI", "color": "orange"},
                        {"name": "AI-Tool-Showcase", "color": "blue"},
                    ]
                }
            },
            "Schedule Date": {"date": {}},
            "Posted Date": {"date": {}},
            "Source Skill": {
                "select": {
                    "options": [
                        {"name": "reel-template", "color": "pink"},
                        {"name": "carousel", "color": "purple"},
                        {"name": "instagram-caption-generator", "color": "blue"},
                        {"name": "comment-gate-reel", "color": "yellow"},
                        {"name": "tool-list-reel", "color": "gray"},
                        {"name": "process-as-content-reel", "color": "brown"},
                        {"name": "manual", "color": "default"},
                    ]
                }
            },
            "Notes": {"rich_text": {}},
            "Asset Path": {"rich_text": {}},
            "URL": {"url": {}},
        },
    }

    resp = requests.post(
        f"{nc.BASE_URL}/databases",
        headers=nc.HEADERS,
        json=schema,
    )
    resp.raise_for_status()
    db = resp.json()
    db_id = db["id"]
    print(f"Created Content Pipeline DB: {db_id}")

    # Update config/notion.json
    config_path = ROOT / "config" / "notion.json"
    with open(config_path) as f:
        cfg = json.load(f)
    cfg["databases"]["content_pipeline"] = db_id
    cfg.setdefault("status_options", {})["content_pipeline"] = [
        "Idea", "Draft", "Review", "Scheduled", "Posted", "Archived"
    ]
    with open(config_path, "w") as f:
        json.dump(cfg, f, indent=2)
    print(f"Updated {config_path}")

    return db_id


if __name__ == "__main__":
    create_db()
```

## Auto-Update Hooks (von anderen Skills)

Wenn diese Skills feuern, MUSS das Resultat in Content Pipeline DB landen:

### reel-template -> Pipeline
```python
from src.shared import notion_client as nc

nc.create_page("content_pipeline", {
    "Title": nc.prop_title(reel["title"]),
    "Format": nc.prop_select("Reel"),
    "Niche": nc.prop_multi_select(reel["niches"]),
    "Hook": nc.prop_rich_text(reel["hook"]),
    "Script": nc.prop_rich_text(reel["script"]),
    "Status": {"status": {"name": "Draft"}},
    "Platform": nc.prop_multi_select(["Instagram", "TikTok"]),
    "Source Skill": nc.prop_select("reel-template"),
    "Source Format": nc.prop_select(reel.get("format_source", "Original")),
    "AI Disclosure": nc.prop_select("None"),
})
```

### carousel -> Pipeline
```python
nc.create_page("content_pipeline", {
    "Title": nc.prop_title(carousel["title"]),
    "Format": nc.prop_select("Carousel"),
    "Niche": nc.prop_multi_select(carousel["niches"]),
    "Hook": nc.prop_rich_text(carousel["slides"][0]),
    "Script": nc.prop_rich_text("\n---\n".join(carousel["slides"])),
    "Status": {"status": {"name": "Draft"}},
    "Source Skill": nc.prop_select("carousel"),
    "Asset Path": nc.prop_rich_text(carousel["output_dir"]),
})
```

### instagram-caption-generator -> Pipeline (update existing)
Wenn es schon einen Draft gibt -> updaten, sonst neu anlegen.

```python
existing = nc.check_duplicate("content_pipeline", "Title", post_title)
props = {
    "Hashtags": nc.prop_rich_text(" ".join(caption["hashtags"])),
    "CTA": nc.prop_select(caption["cta_type"]),
}
if existing:
    nc.update_page(existing["id"], props)
else:
    props["Title"] = nc.prop_title(post_title)
    props["Format"] = nc.prop_select("Reel")
    props["Status"] = {"status": {"name": "Draft"}}
    nc.create_page("content_pipeline", props)
```

## Query Patterns

### Was ist heute geplant?
```python
from datetime import date
nc.query_database("content_pipeline", filter_obj={
    "and": [
        {"property": "Status", "status": {"equals": "Scheduled"}},
        {"property": "Schedule Date", "date": {"equals": date.today().isoformat()}},
    ]
})
```

### Drafts die in Review wandern muessen
```python
nc.query_database("content_pipeline", filter_obj={
    "property": "Status", "status": {"equals": "Draft"}
}, sorts=[{"property": "Schedule Date", "direction": "ascending"}])
```

### Top-Performer der letzten 30 Tage
```python
nc.query_database("content_pipeline", filter_obj={
    "and": [
        {"property": "Status", "status": {"equals": "Posted"}},
        {"property": "Actual Engagement", "number": {"is_not_empty": True}},
    ]
}, sorts=[{"property": "Actual Engagement", "direction": "descending"}])
```

### Was hat unter-performt? (Lerning Loop)
```python
# Posts wo Actual < 50% von Expected
all_posted = nc.query_database("content_pipeline", filter_obj={
    "property": "Status", "status": {"equals": "Posted"}
})
underperformers = [
    p for p in all_posted
    if p["properties"]["Actual Engagement"]["number"]
    and p["properties"]["Expected Engagement"]["number"]
    and p["properties"]["Actual Engagement"]["number"] <
        0.5 * p["properties"]["Expected Engagement"]["number"]
]
```

## Workflow-Integration

1. **Idee** (in Conversation) -> Auto-Save als `Idea` Status
2. **Hook generieren** (manuell / per Reel-Skill) -> Update `Hook` Feld + Status `Draft`
3. **reel-template** / **carousel** generiert Content -> Update `Script` + `Asset Path`
4. **instagram-caption-generator** -> Update `Hashtags` + `CTA`
5. **comment-gate-reel** -> Setze `CTA = Comment-Gate`
6. {User} reviewt in Notion -> Status `Review` -> `Scheduled` + `Schedule Date`
7. **Engagement nachtragen** (nach 7 Tagen) -> Update `Actual Engagement`, Status `Posted`
8. Nach 90 Tagen -> Auto-Archive (`Archived`)

## Pflicht-Regeln

- **AI Disclosure NIEMALS leer** wenn AI-Tools genutzt wurden (Feedback-Regel #4)
- **Asset Path immer setzen** wenn Video/Image im Media-Ordner liegt
- **Source Skill tracken** fuer spaeter Skill-Performance-Analyse
- **Expected Engagement** bei jedem Draft setzen (sonst kein Learning Loop)
- **NIEMALS direkt zu "Posted" ohne `Actual Engagement` Update** (manuell nachtragen)

## Setup-Check (bei jedem Trigger)

```python
import json
from pathlib import Path

cfg_path = Path("config/notion.json")
cfg = json.loads(cfg_path.read_text())

if "content_pipeline" not in cfg["databases"]:
    print("Content Pipeline DB existiert noch nicht. Erstelle...")
    import subprocess
    subprocess.run(["python", "scripts/create_content_pipeline_db.py"], check=True)
    print("DB erstellt. Bitte config/notion.json reload.")
```

## Verwandte Files

- `config/notion.json` (DB Registry)
- `src/shared/notion_client.py` (API Wrapper - bereits da, KEIN Touch)
- `docs/notion/notion-database-ids.md` (Doku - update nach DB-Creation)
- `scripts/create_content_pipeline_db.py` (NEU - wird beim ersten Trigger erstellt)
- `.claude/skills/reel-template/` (Producer)
- `.claude/skills/carousel/` (Producer)
- `.claude/skills/instagram-caption-generator/` (Enricher)

## Notion Status-Optionen (Auto-Setup nach DB-Creation)

Notion's `status` property hat 3 Gruppen: To-do, In progress, Complete.
Mapping:
- **To-do**: Idea
- **In progress**: Draft, Review, Scheduled
- **Complete**: Posted, Archived

Status-Optionen muessen manuell EINMAL in Notion UI angepasst werden (API kann
status options nicht voll konfigurieren), oder via separates `update_database` Call
mit `properties.Status.status.options`.

---
name: gallery-dl
description: Download reference material and inspiration from art platforms (ArtStation, Behance, DeviantArt, Pinterest, Tumblr) using gallery-dl. Use when the user mentions downloading references, art inspiration, mood boards, visual research, gallery-dl, ArtStation, Behance, DeviantArt, or Pinterest downloads.
---

# Gallery-DL Reference Material Downloader

Download art references and inspiration from platforms using `gallery-dl`. Installed via pip.

IMPORTANT: Only download for personal reference/inspiration. Respect copyright. Never redistribute.

## Config Location

Gallery-dl config: `config/gallery-dl.json`

## Basic Usage

```bash
# Download from ArtStation artist page
gallery-dl "https://www.artstation.com/artwork/example"

# Download to specific folder
gallery-dl -d "C:/Users/{DEIN_USER}/Desktop/references" "URL"

# Limit downloads
gallery-dl --range 1-20 "URL"
```

## Platform-Specific Commands

### ArtStation

```bash
# Single artwork
gallery-dl "https://www.artstation.com/artwork/AbCdEf"

# Artist's full gallery
gallery-dl "https://www.artstation.com/artistname"

# Search results
gallery-dl "https://www.artstation.com/search?query=video+mapping"
```

### Behance

```bash
# Single project
gallery-dl "https://www.behance.net/gallery/12345/Project-Name"

# User's projects
gallery-dl "https://www.behance.net/username"
```

### DeviantArt

```bash
# Single deviation
gallery-dl "https://www.deviantart.com/artist/art/Title-12345"

# Artist gallery
gallery-dl "https://www.deviantart.com/artist/gallery"

# Tag search
gallery-dl "https://www.deviantart.com/tag/videomapping"
```

### Pinterest (requires cookies)

```bash
# Pinterest requires authentication via cookies
gallery-dl --cookies "C:/Users/{DEIN_USER}/Desktop/{DEIN_PROJEKT}/config/cookies.txt" \
  "https://www.pinterest.com/pin/12345/"

# Download entire board
gallery-dl --cookies "C:/Users/{DEIN_USER}/Desktop/{DEIN_PROJEKT}/config/cookies.txt" \
  "https://www.pinterest.com/username/board-name/"
```

To export cookies: Use browser extension "Get cookies.txt LOCALLY" and save to `config/cookies.txt`.

### Tumblr

```bash
# Blog posts
gallery-dl "https://blogname.tumblr.com"

# Tagged posts
gallery-dl "https://www.tumblr.com/tagged/projection-mapping"
```

## Config File (config/gallery-dl.json)

```json
{
    "extractor": {
        "base-directory": "C:/Users/{DEIN_USER}/Desktop/references/",
        "filename": "{category}_{subcategory}_{id}_{title}.{extension}",
        "artstation": {
            "external": false
        },
        "pinterest": {
            "cookies": "C:/Users/{DEIN_USER}/Desktop/{DEIN_PROJEKT}/config/cookies.txt"
        }
    },
    "downloader": {
        "rate": "2M",
        "retries": 3
    }
}
```

## Workflow: Mood Board Creation

```bash
# 1. Download references by topic
mkdir -p "C:/Users/{DEIN_USER}/Desktop/references/video-mapping"

gallery-dl -d "C:/Users/{DEIN_USER}/Desktop/references/video-mapping" \
  --range 1-30 \
  "https://www.artstation.com/search?query=projection+mapping"

# 2. Download from multiple sources
URLS=(
  "https://www.artstation.com/search?query=projection+mapping"
  "https://www.behance.net/search/projects?search=video+mapping"
  "https://www.deviantart.com/tag/projectionmapping"
)

for url in "${URLS[@]}"; do
  gallery-dl -d "C:/Users/{DEIN_USER}/Desktop/references/video-mapping" \
    --range 1-10 "$url"
done
```

## File conventions

- References: `C:/Users/{DEIN_USER}/Desktop/references/{topic}/`
- Config: `config/gallery-dl.json`
- Cookies: `config/cookies.txt` (gitignored)

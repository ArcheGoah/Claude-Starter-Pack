---
name: code-garden
description: Generative art system using hardware metrics and algorithmic processes as creative inputs - autonomous art creation
triggers:
  - code garden
  - generative art
  - generative kunst
  - autonome kunst
  - hardware art
  - algorithmic art system
---

# Code Garden - Autonomous Generative Art System

Creates generative art using system metrics, algorithmic processes, and environmental data as creative inputs. Code Garden pieces evolve based on their digital environment.

## When to use
- User wants to create generative/algorithmic art
- Autonomous art creation sessions
- Ecosystem-style generative experiments
- Any "generative", "algorithmic", "autonomous" art request

## Creative Inputs (Metrics as Art)

| Metric | Maps To | Example |
|--------|---------|---------|
| CPU Temperature | Color warmth (cool blue to hot red) | High CPU = warm palette |
| Memory Usage | Density/complexity | More RAM = denser composition |
| Disk I/O | Motion/flow speed | Fast I/O = rapid movement |
| Network Activity | Connectivity/lines | More network = more interconnections |
| Time of Day | Lighting/mood | Night = darker, dawn = gradients |
| Uptime | Growth/maturity | Longer uptime = more evolved forms |
| Process Count | Population density | More processes = more entities |

### Data Collection (Windows)
```bash
wmic cpu get loadpercentage
wmic OS get FreePhysicalMemory,TotalVisibleMemorySize
netstat -e
date +%H:%M
```

## Art Generation Methods

### Method 1: p5.js Generative (Browser-based)
Use existing `algorithmic-art` skill foundation. Flow fields, particle systems, color palettes from metrics.

### Method 2: Canvas API (Node.js)
`npm install canvas` for headless rendering.

### Method 3: SVG Generation
Pure SVG markup - lightweight, scalable, web-ready.

### Method 4: Remotion Video
Animated generative art as video using the video-remotion skill.

## Templates

### Digital Aquarium
- Fish count = active processes
- Water color = CPU temp
- Bubble rate = network activity
- Coral growth = uptime

### Neural Garden
- Node count = memory blocks used
- Connection density = network throughput
- Pruning = garbage collection events

### Data Landscape
- Height = CPU usage over time
- Color = temperature gradient
- Weather = network activity patterns

### Constellation Map
- Stars = files, Connections = imports/dependencies
- Brightness = recent modification, Clusters = directories

## Output
- Save to `tmp_video/code-garden/`
- Formats: PNG (static), SVG (scalable), MP4 (animated via Remotion)
- Metadata: Record which metrics generated this piece (provenance)
- Optional: Export as a series/collection

## Auto-Fire Rules
- User mentions "generative art" or "code garden"
- Aquarium/ecosystem generative content requests
- Any autonomous art creation session

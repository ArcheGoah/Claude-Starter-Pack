---
name: osc-control
description: Control Resolume Arena and MadMapper via OSC (Open Sound Control) using python-osc. Trigger clips, change effects, control opacity, manage layers, and synchronize visuals for live performances and installations. Use when the user mentions Resolume, MadMapper, OSC, VJ, video mapping, live visuals, projection mapping, or stage design control.
---

# OSC Control for Resolume Arena & MadMapper

Control VJ and mapping software via OSC protocol using `python-osc`.

## Setup

```python
from pythonosc import udp_client, osc_message_builder, dispatcher, osc_server

# Resolume Arena (default OSC port: 7000)
resolume = udp_client.SimpleUDPClient("127.0.0.1", 7000)

# MadMapper (default OSC port: 8010)
madmapper = udp_client.SimpleUDPClient("127.0.0.1", 8010)
```

## Resolume Arena OSC Addresses

### Clip Control

```python
# Trigger clip (layer 1, clip 3)
resolume.send_message("/composition/layers/1/clips/3/connect", 1)

# Clear layer
resolume.send_message("/composition/layers/1/clear", 1)

# Select column (triggers clips across all layers)
resolume.send_message("/composition/columns/2/connect", 1)
```

### Layer Control

```python
# Layer opacity (0.0 - 1.0)
resolume.send_message("/composition/layers/1/video/opacity", 0.75)

# Layer bypass (on/off)
resolume.send_message("/composition/layers/1/bypassed", 0)

# Layer blend mode (index)
resolume.send_message("/composition/layers/1/video/mixer/blendmode", 3)

# Layer volume
resolume.send_message("/composition/layers/1/audio/volume", 0.5)
```

### Effect Control

```python
# Effect parameter (layer 1, effect 1, param 1)
resolume.send_message("/composition/layers/1/video/effects/1/params/1", 0.5)

# Effect bypass
resolume.send_message("/composition/layers/1/video/effects/1/bypassed", 1)
```

### Transport

```python
# Composition BPM
resolume.send_message("/composition/tempocontroller/tempo", 128.0)

# Speed of clip
resolume.send_message("/composition/layers/1/clips/1/transport/position/behaviour/speed", 1.0)

# Jump to position (0.0 - 1.0)
resolume.send_message("/composition/layers/1/clips/1/transport/position", 0.5)
```

### Dashboard

```python
# Dashboard parameter by name
resolume.send_message("/composition/dashboard/link1", 0.8)
```

## MadMapper OSC Addresses

### Surface Control

```python
# Surface opacity (0.0 - 1.0)
madmapper.send_message("/surfaces/Surface_1/opacity", 0.75)

# Surface visibility
madmapper.send_message("/surfaces/Surface_1/visible", 1)
```

### Media Control

```python
# Select media by index
madmapper.send_message("/medias/select", 3)

# Media playback
madmapper.send_message("/medias/selected/play", 1)
madmapper.send_message("/medias/selected/pause", 1)
madmapper.send_message("/medias/selected/restart", 1)

# Media speed
madmapper.send_message("/medias/selected/speed", 1.5)
```

### Scene Control

```python
# Go to scene by index
madmapper.send_message("/scenes/go", 2)

# Next/previous scene
madmapper.send_message("/scenes/next", 1)
madmapper.send_message("/scenes/previous", 1)
```

## Full Performance Script Example

```python
#!/usr/bin/env python3
"""Live performance controller for {DEIN_NAME} installations."""

from pythonosc import udp_client
import time

resolume = udp_client.SimpleUDPClient("127.0.0.1", 7000)
madmapper = udp_client.SimpleUDPClient("127.0.0.1", 8010)

def scene_transition(from_layer, to_layer, duration=2.0):
    """Crossfade between two Resolume layers."""
    steps = 50
    for i in range(steps + 1):
        progress = i / steps
        resolume.send_message(f"/composition/layers/{from_layer}/video/opacity", 1.0 - progress)
        resolume.send_message(f"/composition/layers/{to_layer}/video/opacity", progress)
        time.sleep(duration / steps)

def trigger_with_mapping(clip_layer, clip_col, mm_scene):
    """Trigger Resolume clip + MadMapper scene together."""
    resolume.send_message(f"/composition/layers/{clip_layer}/clips/{clip_col}/connect", 1)
    madmapper.send_message("/scenes/go", mm_scene)

# Performance sequence
trigger_with_mapping(1, 1, 0)  # Intro
time.sleep(30)
scene_transition(1, 2, duration=3.0)  # Crossfade to layer 2
trigger_with_mapping(2, 3, 1)  # Main visual + new mapping
```

## Receiving OSC (for sensor input)

```python
from pythonosc import dispatcher, osc_server

def handle_sensor(address, *args):
    print(f"Sensor: {address} = {args}")
    # Map sensor to Resolume parameter
    resolume.send_message("/composition/layers/1/video/opacity", args[0])

disp = dispatcher.Dispatcher()
disp.map("/sensor/*", handle_sensor)

server = osc_server.ThreadingOSCUDPServer(("0.0.0.0", 9000), disp)
server.serve_forever()
```

## File conventions

- OSC scripts: `scripts/osc/*.py`
- Performance configs: `config/osc-performances.json`

---
name: blender-control
description: Ultimate Blender AI control via MCP — modeling, sculpting, materials, lighting, rendering, animation, fabrication, procedural art, AI 3D generation. 22,000+ lines of Python reference across 11 specialized guides.
version: 2.0.0
author: {DEIN_NAME} Studio
triggers:
  - blender
  - 3d model
  - render
  - sculpt
  - material
  - mirror
  - disco
  - spiegel
  - cnc
  - stl export
  - hdri
  - lighting
  - viewport
  - animation
  - physics
  - particle
  - fabrication
  - 3d print
  - geometry nodes
  - procedural
  - texture
---

# Blender Control — Ultimate AI Skill v2.1

## ⚠️ CRITICAL PRECONDITIONS (READ FIRST BEFORE ANY MCP CALL)

**Zwei parallele MCP-Server** sind verfügbar — Entscheidungsregel:

### Server Decision Rule
| Use-Case | Server | Reason |
|----------|--------|--------|
| **Default:** modeling, materials, lighting, sculpting, rendering | `mcp__blend-ai__*` (164 tools) | Neuere, umfangreichere Toolbox |
| Polyhaven HDRI/Assets download | `mcp__blender__*` (alt) | Polyhaven integration exklusiv hier |
| Sketchfab model download | `mcp__blender__*` (alt) | Sketchfab integration exklusiv hier |
| Rodin Gen-2 / Hyper3D image-to-3D | `mcp__blender__generate_hyper3d_model_via_images` | Hyper3D integration |
| Hunyuan3D image-to-3D | `mcp__blender__generate_hunyuan3d_model` | Hunyuan integration |
| Viewport screenshots | EITHER (beide haben es) | Bevorzuge `mcp__blend-ai__capture_viewport` |
| Geometry Nodes (Blender 5.0+) | `mcp__blend-ai__create_geometry_nodes` | blend-ai hat alle 164 node types |

### Setup Preconditions (IMMER vor erstem MCP-Call prüfen)
1. **Blender geöffnet?** — User muss Blender manuell starten (nicht headless)
2. **blend-ai Addon aktiviert?** — Preferences → Add-ons → enable "blend-ai"
3. **N-Panel Server läuft?** — In Blender 3D Viewport: `N` Panel → blend-ai → **Start Server** (Port 9876)
4. **Claude Desktop MCP config** — `.mcp.json` muss `blend-ai` entry haben (siehe `tools/blend-ai/README.md`)
5. **Bug-Fix:** Alte Calls nutzen `set_origin` → IMMER `set_object_origin` verwenden (blend-ai renamed das)

**Wenn Server nicht läuft:** MCP-Calls timeouten ohne Fehlermeldung. Erst Connection prüfen:
```bash
curl http://localhost:9876/health  # expect 200 OK
```

### Blender 5.0 Game-Changers (2026)
- **SDF + Volume Grid Geometry Nodes** — Native replacement für Python disco-ball tile distribution
- **6 neue GN Modifiers** — Scatter on Surface, Instance on Elements, Distribute Points, etc.
- **Vulkan backend stable** — 20-40% schneller für viewport
- **Grease Pencil 5.0** — Neu in Main geometry type

**Migration Note:** {Users} make-discoball Skill sollte auf GN Scatter on Surface umsteigen statt Python ray-cast.

---

## UPGRADE 2026-04-11: blend-ai (164 Tools / 24 Module)

**Lokal verfuegbar:** `tools/blend-ai/`
**Repo:** https://github.com/jabberwock/blend-ai
**Inspiration aus:** Jhoni Ceron Reel (`video-imports/VI_2026-04-11_ig_jhoniceron-blender5-claude-mcp-134-tools.md`) — er erwaehnt 134 Tools, blend-ai bietet 164.

### 24 Module Coverage:
modeling, mesh editing, materials, shader nodes, lighting, camera, animation, rendering, sculpting, UV mapping, physics, geometry nodes, rigging, curves, annotations, collections, file I/O, Bool Tool, viewport control, mesh quality analysis, extension suggestions

### Image-to-3D Pipeline (Killer Use-Case):
1. Foto eines Werks/Raums → Claude Desktop
2. blend-ai MCP feuert relevante Tools (modeling + materials + lighting)
3. Iteration-Loop: "Verbessere Proportionen, Materialien"
4. Nach 2-3 Iterations sehr nah am Original

### Setup
```bash
cd tools/blend-ai
# Install addon in Blender
python install_addon.py
# Configure Claude Desktop MCP
# (siehe blend-ai/README.md fuer claude_desktop_config.json)
```

### Use-Cases fuer {User}:
- **Werk → 3D fuer AR/Online-Show:** Foto eines Werks → editierbare 3D-Variante
- **Ausstellungsplanung:** Foto eines Raums → 3D Mockup mit Werken
- **Tank-/Aquarium-Visualization:** Real-time Iteration auf 3D Tank-Models
- **Discoball Generation:** Mit `make-discoball` Skill kombinieren

### Kombinationen
- `make-discoball` Skill ueber blend-ai Tools
- `particle-hero` fuer Web-Export der Blender-Szenen
- `ar-poster-pipeline` fuer AR-Werkverzeichnis

---


Remote-control Blender via MCP. 22,000+ lines of tested Python code across 11 reference guides.

## Prerequisites

- Blender 4.0+ with MCP addon (N-panel → BlenderMCP → Start MCP Server on port 9876)
- `blender` MCP server in `.mcp.json`

## Knowledge Base (docs/research/)

Read the relevant guide BEFORE executing complex operations:

| Guide | Lines | Topics |
|-------|-------|--------|
| `blender-modeling-sculpting.md` | 3,737 | Mesh creation, bmesh, booleans, curves, metaballs, sculpting, form manipulation, shape recognition |
| `blender-deep-python-api.md` | 4,263 | Geometry Nodes, Shader Nodes, particles, physics, rigging, shape keys, animation, modifiers, UV, compositing, VSE |
| `blender-fabrication-pipeline.md` | 3,105 | CNC 5-axis, 3D print, XPS/Styrofoam, segmentation, mold making, STL export, G-code |
| `blender-lighting-rendering.md` | 2,928 | All light types, studio setups, gallery lighting, HDRI, volumetrics, caustics, camera rigs, compositing, batch render |
| `blender-materials-bible.md` | ~2,000 | Every material (metals, stone, glass, fabric, organic, neon, holographic, PBR), all shader nodes |
| `blender-mcp-advanced.md` | 1,943 | MCP limitations, safe chaining, error recovery, PolyHaven, Sketchfab, Hyper3D, Hunyuan3D, AI mesh cleanup, scene templates |
| `blender-animation-simulation.md` | ~1,500 | Keyframes, drivers, F-curves, NLA, rigid/soft/cloth/fluid physics, particles, force fields, turntable, disco motor |
| `blender-procedural-art.md` | ~900 | Psychedelic patterns, fractals, LED simulation, projection mapping prep, mirror mosaic effect, parametric sculpture |
| `blender-scene-management.md` | ~800 | Collections, transforms, constraints, scene templates (studio/gallery/outdoor/dramatic), cleanup, measurement |
| `blender-automation-guide.md` | 644 | MCP overview, import/export, mirror mosaic, CNC prep basics |
| `blender-ai-tools-2026.md` | ~500 | All AI tools comparison, best MCP servers, Text/Image-to-3D ranking, StableGen, TRELLIS 2 |

## MCP Tools Quick Reference

### Scene
```
mcp__blender__get_scene_info          — Full scene dump
mcp__blender__get_object_info         — Object details
mcp__blender__get_viewport_screenshot — Viewport capture
mcp__blender__execute_blender_code    — Run Python (THE power tool)
```

### Assets
```
mcp__blender__search_polyhaven_assets     — Find HDRIs/textures/models
mcp__blender__download_polyhaven_asset    — Import PolyHaven assets
mcp__blender__set_texture                 — Apply texture
mcp__blender__search_sketchfab_models     — Search Sketchfab
mcp__blender__download_sketchfab_model    — Import from Sketchfab
```

### AI 3D Generation
```
mcp__blender__generate_hyper3d_model_via_text    — Text → 3D
mcp__blender__generate_hyper3d_model_via_images  — Image → 3D
mcp__blender__import_generated_asset             — Import Hyper3D model
mcp__blender__generate_hunyuan3d_model           — Hunyuan Text/Image → 3D
mcp__blender__import_generated_asset_hunyuan     — Import Hunyuan model
```

## Critical MCP Rules

1. **One operation per execute_blender_code call** — complex chains crash
2. **50-80 lines optimal** — 200+ lines unreliable
3. **Always screenshot after changes** to verify
4. **Save before risky ops** (booleans, high subdivision, voxel remesh)
5. **What crashes:** Booleans on high-poly, Subdivision 4+, tiny voxel remesh values
6. **What doesnt work:** Interactive sculpting, undo via MCP, file dialogs

## Essential Code Patterns

### Import Models
```python
# GLB
bpy.ops.import_scene.gltf(filepath="C:/path/model.glb", import_pack_images=True)
# OBJ (Blender 4.0+)
bpy.ops.wm.obj_import(filepath="C:/path/model.obj")
# FBX
bpy.ops.import_scene.fbx(filepath="C:/path/model.fbx")
# STL
bpy.ops.import_mesh.stl(filepath="C:/path/model.stl")
```

### Post-Import Cleanup
```python
for obj in bpy.context.selected_objects:
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='BOUNDS')
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.remove_doubles(threshold=0.0001)
    bpy.ops.mesh.normals_make_consistent(inside=False)
    bpy.ops.object.mode_set(mode='OBJECT')
```

### Materials

```python
# Mirror (Metallic=1, Roughness=0, Black base)
bsdf.inputs['Base Color'].default_value = (0, 0, 0, 1)
bsdf.inputs['Metallic'].default_value = 1.0
bsdf.inputs['Roughness'].default_value = 0.0

# Glass (Transmission=1, IOR=1.45)
bsdf.inputs['Transmission Weight'].default_value = 1.0
bsdf.inputs['IOR'].default_value = 1.45

# Emission/Glow
emission.inputs['Color'].default_value = (1.0, 0.4, 0.05, 1)
emission.inputs['Strength'].default_value = 15.0

# Full recipes: → blender-materials-bible.md
# Gold, Silver, Copper, Marble, Wood, Silk, Neon, Holographic, Chrome...
```

### Mirror Mosaic / Disco Ball
```python
# Apply to ANY mesh
bpy.ops.object.mode_set(mode='EDIT')
bm = bmesh.from_edit_mesh(obj.data)
bmesh.ops.triangulate(bm, faces=bm.faces[:])
bmesh.ops.inset_individual(bm, faces=bm.faces[:], thickness=0.01, depth=0.0)
bmesh.update_edit_mesh(obj.data)
bpy.ops.object.mode_set(mode='OBJECT')
# Then apply mirror material + solidify modifier
```

### Lighting Setups
```python
# Spot light with Track To
bpy.ops.object.light_add(type='SPOT', location=(3, -3, 4))
light = bpy.context.active_object
light.data.energy = 1000
light.data.spot_size = 0.5
constraint = light.constraints.new(type='TRACK_TO')
constraint.target = target_obj

# Full setups: → blender-lighting-rendering.md
# 3-point, Rembrandt, gallery/museum, dramatic, disco...
```

### Render
```python
bpy.context.scene.render.engine = 'CYCLES'
bpy.context.scene.cycles.samples = 256
bpy.context.scene.render.resolution_x = 1920
bpy.context.scene.render.resolution_y = 1080
bpy.context.scene.render.filepath = "C:/path/render.png"
bpy.ops.render.render(write_still=True)
```

### Animation — Turntable
```python
obj.rotation_euler = (0, 0, 0)
obj.keyframe_insert(data_path="rotation_euler", frame=1)
obj.rotation_euler = (0, 0, math.radians(360))
obj.keyframe_insert(data_path="rotation_euler", frame=120)
# Set to linear interpolation for smooth loop
for fc in obj.animation_data.action.fcurves:
    for kp in fc.keyframe_points:
        kp.interpolation = 'LINEAR'
```

### STL Export for CNC
```python
bpy.ops.export_mesh.stl(
    filepath="C:/path/output.stl",
    use_selection=True,
    global_scale=1000.0,  # m → mm
    use_mesh_modifiers=True
)
```

### Scene Setup
```python
# Metric units
bpy.context.scene.unit_settings.system = 'METRIC'
# Dark background
world = bpy.context.scene.world
world.use_nodes = True
bg = world.node_tree.nodes['Background']
bg.inputs[0].default_value = (0.01, 0.01, 0.02, 1)
```

### Save File
```python
bpy.ops.wm.save_as_mainfile(filepath="C:/path/scene.blend")
```

## Workflow Pipelines

### AI Model → Blender → Render
1. Generate via Hyper3D/Hunyuan (text or image prompt)
2. Import generated asset
3. Cleanup (remove doubles, fix normals, decimate)
4. Scale to real-world size
5. Apply materials
6. Set up lighting (scene template)
7. Camera rig
8. Render

### AI Model → CNC Fabrication
1. Generate/import 3D model
2. Cleanup + repair mesh
3. Scale to real dimensions (mm)
4. Validate (manifold, wall thickness)
5. Segment for CNC block size
6. Add alignment pins between segments
7. Export STL per segment
8. → CAM software → G-code → Machine

### Mirror-Mosaic Sculpture Pipeline
1. Krea image → clean mannequin rendering
2. Hyper3D image-to-3D → generate figure
3. Import to Blender → cleanup
4. Scale to life-size (1.75m)
5. Add umbrella half-dome
6. Apply mirror mosaic (inset_individual + mirror material)
7. Setup disco lighting (spots + caustics)
8. Animate rotation (disco motor, 1-3 RPM)
9. Render visualization
10. Export STL segments for CNC (XPS)

## Deep Reference

For detailed code on ANY topic, read the relevant guide in `docs/research/blender-*.md`.
All code is tested on Blender 4.0.0 and works via `execute_blender_code`.

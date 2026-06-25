---
name: ae-automation
description: Automate Adobe After Effects via ExtendScript (.jsx), aerender CLI, and Computer Use for batch rendering, composition creation, footage import, and frame export. Use when the user mentions After Effects, AE, batch render, ExtendScript, aerender, motion graphics automation, or composition templates.
---

# After Effects Automation

Automate Adobe After Effects workflows for {DEIN_NAME} Studio.

## 1. ExtendScript (.jsx)

AE executes JSX scripts via File > Scripts > Run Script or CLI. Save scripts to `scripts/ae/`.

### Run a script from CLI

```bash
"/c/Program Files/Adobe/Adobe After Effects 2025/Support Files/AfterFX.com" -s "$.evalFile('C:/Users/{DEIN_USER}/projects/my-project/scripts/ae/batch-render.jsx')"
```

### Common ExtendScript patterns

**Import footage from media folder:**

```javascript
var folder = new Folder("media/Video");
var files = folder.getFiles("*.mp4");
var importOptions = new ImportOptions();
for (var i = 0; i < files.length; i++) {
    importOptions.file = files[i];
    app.project.importFile(importOptions);
}
```

**Create composition from template:**

```javascript
var templateComp = app.project.item(1);
var newComp = templateComp.duplicate();
newComp.name = "New_Project_001";
var layer = newComp.layer(1);
var newSource = app.project.importFile(new ImportOptions(new File("media/footage/clip.mp4")));
layer.replaceSource(newSource, false);
```

**Export single frames (PNG sequence):**

```javascript
var comp = app.project.activeItem;
var item = app.project.renderQueue.items.add(comp);
var om = item.outputModule(1);
om.applyTemplate("PNG Sequence");
om.file = new File("C:/Users/{DEIN_USER}/Desktop/output/frame_[#####]");
app.project.renderQueue.render();
```

**Batch add to render queue:**

```javascript
for (var i = 1; i <= app.project.numItems; i++) {
    var item = app.project.item(i);
    if (item instanceof CompItem && item.name.indexOf("RENDER_") === 0) {
        var rqItem = app.project.renderQueue.items.add(item);
        rqItem.outputModule(1).applyTemplate("H.264 - Match Render Settings");
        rqItem.outputModule(1).file = new File("C:/Users/{DEIN_USER}/Desktop/renders/" + item.name + ".mp4");
    }
}
app.project.renderQueue.render();
```

## 2. aerender CLI

Headless rendering without opening AE GUI.

```bash
AERENDER="/c/Program Files/Adobe/Adobe After Effects 2025/Support Files/aerender.exe"

# Render specific comp
"$AERENDER" -project "media/AE_Projects/project.aep" -comp "Main_Comp" -output "C:/renders/output.mp4"

# Render with settings
"$AERENDER" -project "media/AE_Projects/project.aep" -comp "Instagram_Reel" \
  -s 0 -e 2700 -RStemplate "Best Settings" -OMtemplate "H.264 - Match Render Settings" \
  -output "C:/renders/reel_[####].mp4"
```

| Flag | Purpose |
|------|---------|
| `-project` | Path to .aep file |
| `-comp` | Composition name |
| `-s` / `-e` | Start/end frame |
| `-RStemplate` | Render Settings template |
| `-OMtemplate` | Output Module template |
| `-output` | Output file path |
| `-mem_usage` | Memory (e.g., `50 50`) |
| `-mp` | Enable multiprocessing |

## 3. Computer Use (fallback)

For GUI interaction (effects, keyframes). Use Playwright or Computer Use MCP.

## File conventions

- ExtendScript: `scripts/ae/*.jsx`
- AE templates: `media/AE_Projects/templates/`
- Render output: `C:/Users/{DEIN_USER}/Desktop/renders/`

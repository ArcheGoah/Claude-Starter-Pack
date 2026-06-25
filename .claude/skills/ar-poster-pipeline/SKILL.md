---
name: ar-poster-pipeline
description: Automatisierter Workflow fuer AR Plakat-Erlebnisse mit Multi-Layer Depth. SAM-Segmentierung + Kling AI Animationen + transparente Video-Overlays + Three.js AR. Auto-Extraktion von Pop-out Elementen aus Plakaten, Difference-Matte fuer AR-Animationen, Deployment auf Vercel mit WebAR (MindAR.js). Trigger: "AR app fuer Plakat", "Plakat scannen", "Augmented Reality Erlebnis", "MindAR", "WebAR", "Kling Animation transparent machen".
---

# AR Poster Pipeline

Automatisierter Workflow fuer WebAR-Erlebnisse wo ein gezeichnetes Plakat gescannt wird und Multi-Layer Animationen darueber erscheinen.

## Architektur

```
Layer -1: Sky Extension (hinter Plakat)
Layer 0:  Physisches Plakat
Layer 1:  Ambient FX Video (transparent, ueber ganzes Plakat)
Layer 2:  Pop-out Elemente (ausgeschnittene PNGs schweben vor dem Plakat)
Layer 3:  Floating Particles (Three.js, free 3D space)
```

## Tech Stack

- **MindAR.js** + **Three.js** (WebAR)
- **SAM** (Ultralytics) fuer automatische Element-Extraktion
- **Kling AI** (Krea) fuer Animationen mit "black background" prompts
- **ffmpeg** fuer Difference-Matte + Alpha-Video-Encoding
- **Python** (OpenCV, rembg, PIL) fuer Automation
- **Vercel** fuer Deployment
- **@napi-rs/canvas** + MindAR offline-compiler fuer .mind Target Generation

## Workflow Schritte

### 1. Plakat vorbereiten
```python
# Konvert PDF → JPG 300 DPI
import fitz
doc = fitz.open('poster.pdf')
pix = doc[0].get_pixmap(matrix=fitz.Matrix(300/72, 300/72))
pix.save('poster-target.jpg')

# Resize auf 1200px fuer MindAR compilation
from PIL import Image
img = Image.open('poster-target.jpg')
img.resize((1200, int(img.height * 1200 / img.width))).save('poster-target.jpg')
```

### 2. MindAR Target kompilieren (Node.js)
Brauche `@napi-rs/canvas` als Shim fuer `canvas` (native canvas compiliert nicht auf Windows/Node 24).

```javascript
// compile.mjs
import { OfflineCompiler } from 'mind-ar/src/image-target/offline-compiler.js';
import { loadImage } from '@napi-rs/canvas';

// Shim: node_modules/canvas/index.js re-exports @napi-rs/canvas
const compiler = new OfflineCompiler();
const img = await loadImage('poster-target.jpg');
await compiler.compileImageTargets([img], (p) => console.log(p));
const buffer = compiler.exportData();
fs.writeFileSync('targets.mind', Buffer.from(buffer));
```

### 3. Element-Extraktion mit SAM
```python
from ultralytics import SAM
model = SAM('sam2_b.pt')  # oder mobile_sam.pt
results = model('poster.jpg')
# Jedes Segment als PNG mit Alpha + bbox
```

### 4. Kling Videos transparent machen

**Option A: Gezielt mit "on black background" generieren**
```
ffmpeg -i effect.mp4 -vf "colorkey=0x000000:0.3:0.1,format=yuva420p" \
  -c:v libvpx-vp9 output.webm
```

**Option B: Difference Matte fuer existierende Videos**
```python
import cv2
cap = cv2.VideoCapture('kling.mp4')
poster = cv2.imread('poster.jpg')
while True:
    ret, frame = cap.read()
    diff = cv2.absdiff(frame, poster)
    mask = (diff.sum(axis=2) > 30).astype('uint8') * 255
    # ... save with alpha
```

### 5. Dual-Format Video Export (Safari + Chrome)
```
# WebM VP9 Alpha (Chrome/Firefox/Android)
ffmpeg -i in.mov -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 5M out.webm

# HEVC Alpha (Safari/iOS)
ffmpeg -i in.mov -c:v hevc_videotoolbox -alpha_quality 1 out.mov
```

### 6. Music Track Processing (Distant Stage)
```bash
ffmpeg -ss 30 -t 90 -i "music-track.wav" \
  -af "lowpass=f=1800,highpass=f=80,volume=0.6,aecho=0.5:0.7:60:0.3" \
  -b:a 96k track.mp3
```

### 7. Three.js Scene Building
```javascript
// Lade elements.json mit normalisierten BBoxes
elements.forEach(el => {
  const texture = new THREE.TextureLoader().load(el.png);
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(el.bbox.width, el.bbox.height),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true })
  );
  plane.position.set(el.bbox.centerX, el.bbox.centerY, el.zOffset);
  anchor.group.add(plane);
});
```

## Kritische Erkenntnisse

### MindAR
- **filterMinCF: 0.0001, filterBeta: 0.001** fuer stabiles Tracking
- **warmupTolerance: 5, missTolerance: 17** fuer ruhiges Tracking
- Camera-Constraints **MUESSEN vor mindarThree.start()** gepatched werden — applyConstraints() nach Start bricht Tracking
- `navigator.mediaDevices.getUserMedia` monkey-patchen fuer Full HD Camera

### Video Recording (Full HD 9:16)
- Recording Canvas: 1080x1920
- Compositing MUSS atomisch im Three.js Render-Loop passieren (nach renderer.render() ist WebGL Buffer frisch)
- Bitrate: 25 Mbps, MP4 H.264 bevorzugt, WebM Fallback
- `captureStream(60)` fuer fluessiges Video

### Sound-Engine (Web Audio API)
- AudioContext muss vor User-Gesture initialisiert werden
- Layers: Music Track (random) + Crowd Voices (6 formant-filtered noise sources mit random speaking bursts) + Background Hush + Random Events (footsteps, cheers, clinks)
- StereoPanner fuer Spatial Audio
- LFOs fuer Dynamic Volume + Pan Movement

### iPhone Kompatibilitaet
- `es-module-shims` fuer alte iOS (<16.4) die Import Maps nicht unterstuetzen
- `top: 32px` statt `max(calc(env(...)))` fuer Safe Area (Safari bugs)
- `100dvh` statt `100vh` fuer echte sichtbare Hoehe

## Deployment

```bash
# Vercel config (vercel.json):
{
  "outputDirectory": "public",
  "headers": [{
    "source": "/targets.mind",
    "headers": [{ "key": "Content-Type", "value": "application/octet-stream" }]
  }]
}

vercel --prod --yes
```

QR-Code Generation:
```python
import qrcode
qr = qrcode.QRCode(version=2, error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=20, border=4)
qr.add_data('https://your-project.vercel.app')
```

## Krea/Kling API Workflow (fuer spaeter wenn Credits vorhanden)

**API Config:** `config/krea.json` — enthaelt Key + Model-Kosten
**Cloudflare Bypass:** Braucht `requests` mit User-Agent (urllib wird mit 1010 blockiert)
**Endpoint:** `POST https://api.krea.ai/generate/video/kling/kling-2.1` (OHNE `/v1/`)

**Request Payload (Image-to-Video):**
```json
{
  "prompt": "animation description",
  "startImage": "data:image/png;base64,iVBORw0...",
  "aspectRatio": "9:16",
  "duration": 5,
  "mode": "pro"
}
```

**Image Upload:** Base64 Data-URI direkt im startImage field (kein separater Upload).

**Response:**
```json
{
  "job_id": "uuid",
  "status": "queued"
}
```

**Polling:** `GET https://api.krea.ai/jobs/{job_id}` alle 5 Sekunden bis `status: completed`

**Video URL:** Im `result.video_url` oder `result.url` field.

**Kosten (Kling 2.1 Pro Plan):**
- Kling 2.1: 208 credits/video
- Kling 2.6: 336 credits
- Runway Gen4 Turbo: 197 credits
- Pro Plan: 20K credits/Monat

**Fehler `402 INSUFFICIENT_BALANCE`:** Credits aufgebraucht — User muss auf krea.ai/dashboard pruefen.

**Skript:** `ar-poster/krea_animate.py` (functional, wartet auf Credits)

## Video Ping-Pong Loop Workflow (aktiv genutzt)

Kling Videos sind nie geloopt → seamless Loop via Palindrome (forward + reverse concat):

```bash
ffmpeg -i in.mp4 -filter_complex \
  "[0:v]split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1[v]" \
  -map "[v]" -c:v libx264 -preset fast out.mp4
```

## SAM Segmentation Pipeline (gelernt 2026-04-10)

**Tool:** Ultralytics SAM (`pip install ultralytics`)
**Models verglichen:**
- `mobile_sam.pt` (38MB) — schnell, 30 Segmente, mittlere Qualitaet
- `sam2_b.pt` (155MB) — gut, 15 Segmente, hohe Qualitaet
- `sam2_l.pt` (428MB) — beste Qualitaet, 37 Segmente, langsamster

**Trick: Kombiniere alle 3 Modelle + Dedupe via IoU > 0.6**
- SAM2-L gewinnt meist (37 Regionen)
- MobileSAM erwischt oft 10+ Regionen die SAM2-L verpasst
- SAM2-B bringt nur 1-2 zusaetzliche
- Total ~48 unique Regionen aus 82 raw segments

**Best Practice:** Auto-mode (alle Segmente) + Filter nach Area (1500 < area < 70%) + Dedupe via IoU

## Three.js Custom Shader fuer Alpha-Maske (gelernt 2026-04-10)

**Problem:** WebM VP9/VP8 Alpha-Encoding ist unzuverlaessig — pix_fmt bleibt yuv420p
**Loesung:** Shader mit 2 Texturen — Video gibt RGB, PNG gibt Alpha

```glsl
// Vertex
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// Fragment
uniform sampler2D videoTex;
uniform sampler2D maskTex;
varying vec2 vUv;
void main() {
  vec4 color = texture2D(videoTex, vUv);
  vec4 mask = texture2D(maskTex, vUv);
  if (mask.a < 0.05) discard;
  gl_FragColor = vec4(color.rgb, mask.a);
}
```

**Three.js Material:**
```js
new THREE.ShaderMaterial({
  uniforms: { videoTex: { value: vTex }, maskTex: { value: mTex } },
  vertexShader, fragmentShader,
  transparent: true, side: THREE.DoubleSide, depthWrite: false,
});
```

## Video Cropping per BBox (gelernt 2026-04-10)

**ffmpeg crop + ping-pong palindrome loop:**
```bash
ffmpeg -y -ss 0 -t 4.0 -i input.mp4 \
  -filter_complex "[0:v]crop=W:H:X:Y[c];[c]split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1[v]" \
  -map "[v]" -c:v libx264 -preset fast -crf 26 -pix_fmt yuv420p -an out.mp4
```

**Wichtig:** crop dimensions muessen even sein (h264 requirement)
**Resultat:** Seamless loop, ~12 MB fuer 343 clips (43 elements x 8 vids)

## HuggingFace Spaces fuer Video AI (gelernt 2026-04-10)

**Library:** `gradio_client` (v2.4.0)
**Working Spaces:**
- `multimodalart/stable-video-diffusion` — modern API, funktioniert
- `wavespeed/wan-image-to-video` — alte API mit ws protocol issues

**Quota:** HF Free Tier hat ZeroGPU mit ~120s/Tag GPU-Zeit
**Praktisch:** ~3-5 Videos pro 24h pro Account
**API Pattern:**
```python
client = Client('multimodalart/stable-video-diffusion')
resized = client.predict(image=handle_file(img), api_name='/resize_image')
result = client.predict(image=handle_file(resized['path']), seed=42, randomize_seed=True,
  motion_bucket_id=180, fps_id=8, api_name='/video')
video_path = result[0]['video']
```

## Cloudflare-blocked APIs

Krea API ist hinter Cloudflare. `urllib` wird mit Fehler 1010 blockiert.
**Loesung:** `requests` library MIT User-Agent header:
```python
headers = {
    "Authorization": f"Bearer {key}",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ...",
    "Accept": "application/json",
}
```

## Element Animation Workflow ({Users} Pipeline)

1. **Plakat → SAM** segments (3 models, dedupe)
2. **PNGs mit Alpha** in `elements_best/`
3. **Kling Videos** zum Plakat → animate ganzes Plakat
4. **ffmpeg Crop** per element bbox aus Kling Video
5. **Three.js Shader**: Video=RGB + PNG=Alpha
6. **Zufaellige Variante** pro Session

## GPU Requirements fuer Lokale Video AI

| Model | Min VRAM | Recommended |
|---|---|---|
| LTX-Video | 8 GB | 12+ GB |
| CogVideoX-5B | 8 GB | 12+ GB |
| AnimateDiff | 6 GB | 8+ GB |
| Stable Video Diffusion | 6 GB | 8+ GB |
| Wan 2.5 | 8 GB | 12+ GB |

**GTX 1050 Ti (4GB)** ist zu klein fuer alle Video AI Modelle.
Cloud-only Workflow noetig wenn keine bessere GPU.

## Vercel Deployment Tips

- `.vercelignore` mit `/elements/` (absolute path) statt `elements/` um nur root zu matchen
- `*.pt` ignorieren (SAM models)
- 100 MB single-file limit
- Free tier 100GB bandwidth/Monat

## Projekt-Referenz

- Erstes Projekt: `ar-poster/` (a light art festival 2026)
- Live: https://your-project.vercel.app

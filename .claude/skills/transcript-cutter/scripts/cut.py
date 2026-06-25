#!/usr/bin/env python3
"""
Transcript-Cutter - Schneidet Video basierend auf cut_points.json.
Usage:
  cut.py input.mp4 cut_points.json output.mp4 [--format mp4|fcpxml|markers] [--mode highlight|filler-removal]
"""
import argparse
import json
import os
import shlex
import subprocess
import sys
from pathlib import Path
from datetime import datetime

FFMPEG = os.environ.get(
    "FFMPEG_BIN",
    r"C:\Users\{DEIN_USER}\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1-full_build\bin\ffmpeg.exe",
)


def run(cmd, capture=False):
    if capture:
        return subprocess.run(cmd, check=True, capture_output=True, text=True)
    return subprocess.run(cmd, check=True)


def load_cuts(path):
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    if isinstance(data, list):
        return {"cuts": data}
    return data


def cut_mp4(src, cuts, dst):
    """Extract each cut as separate clip, then concat."""
    tmp_dir = Path(dst).parent / f".cut_tmp_{Path(dst).stem}"
    tmp_dir.mkdir(parents=True, exist_ok=True)

    concat_list = tmp_dir / "concat.txt"
    parts = []
    for i, c in enumerate(cuts["cuts"]):
        start = float(c["start"])
        end = float(c["end"])
        dur = max(end - start, 0.1)
        out = tmp_dir / f"part_{i:03d}.mp4"
        cmd = [
            FFMPEG, "-y",
            "-ss", f"{start}",
            "-i", str(src),
            "-t", f"{dur}",
            "-c:v", "libx264", "-preset", "veryfast", "-crf", "18",
            "-c:a", "aac", "-b:a", "192k",
            str(out),
        ]
        print(f"  [{i+1}/{len(cuts['cuts'])}] {start:.2f}-{end:.2f} ({c.get('reason', '')})")
        run(cmd)
        parts.append(out)

    with concat_list.open("w") as f:
        for p in parts:
            f.write(f"file '{p.as_posix()}'\n")

    cmd = [
        FFMPEG, "-y",
        "-f", "concat", "-safe", "0",
        "-i", str(concat_list),
        "-c", "copy",
        str(dst),
    ]
    run(cmd)
    print(f"\n✅ Output: {dst}")

    for p in parts:
        p.unlink()
    concat_list.unlink()
    tmp_dir.rmdir()


def cut_fcpxml(src, cuts, dst):
    """Generate xmeml v5 for Premiere Pro import (subset)."""
    fps_num, fps_den = 30000, 1001  # 29.97 default
    resource = f"""<file id="file-1">
  <name>{Path(src).name}</name>
  <pathurl>file://localhost/{Path(src).as_posix()}</pathurl>
  <media><video><samplecharacteristics><width>1920</width><height>1080</height></samplecharacteristics></video></media>
</file>"""

    clipitems = []
    in_point = 0
    for i, c in enumerate(cuts["cuts"]):
        start_f = int(round(float(c["start"]) * fps_num / fps_den))
        end_f = int(round(float(c["end"]) * fps_num / fps_den))
        dur = end_f - start_f
        clipitems.append(f"""<clipitem id="clip-{i}">
  <name>{c.get('label', f'cut_{i}')}</name>
  <start>{in_point}</start>
  <end>{in_point + dur}</end>
  <in>{start_f}</in>
  <out>{end_f}</out>
  <file id="file-1"/>
</clipitem>""")
        in_point += dur

    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE xmeml>
<xmeml version="5">
  <sequence>
    <name>transcript-cut-{datetime.now().strftime('%Y%m%d-%H%M%S')}</name>
    <duration>{in_point}</duration>
    <rate><timebase>30</timebase><ntsc>TRUE</ntsc></rate>
    <media>
      <video>
        <track>
          {resource}
          {''.join(clipitems)}
        </track>
      </video>
    </media>
  </sequence>
</xmeml>"""
    Path(dst).write_text(xml, encoding="utf-8")
    print(f"✅ FCPXML: {dst} (Premiere: File → Import)")


def cut_markers(src, cuts, dst):
    """Emit marker list for premiere-mcp-bridge."""
    markers = []
    for c in cuts["cuts"]:
        markers.append({
            "time": float(c["start"]),
            "label": c.get("label", c.get("reason", "cut"))[:60],
            "type": "in",
        })
        markers.append({
            "time": float(c["end"]),
            "label": f"end_{c.get('label', 'cut')}"[:60],
            "type": "out",
        })
    Path(dst).write_text(json.dumps({"source": str(src), "markers": markers}, indent=2), encoding="utf-8")
    print(f"✅ Markers: {dst} ({len(markers)} markers)")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("input", help="Source video")
    ap.add_argument("cuts", help="cut_points.json")
    ap.add_argument("output", help="Output file")
    ap.add_argument("--format", choices=["mp4", "fcpxml", "markers"], default="mp4")
    ap.add_argument("--mode", default="highlight")
    args = ap.parse_args()

    if not Path(args.input).exists():
        sys.exit(f"❌ Input missing: {args.input}")
    if not Path(args.cuts).exists():
        sys.exit(f"❌ Cuts missing: {args.cuts}")

    cuts = load_cuts(args.cuts)
    if not cuts.get("cuts"):
        sys.exit("❌ cut_points.json has no 'cuts' array")

    print(f"→ {len(cuts['cuts'])} cut(s), format={args.format}, mode={args.mode}")

    if args.format == "mp4":
        cut_mp4(args.input, cuts, args.output)
    elif args.format == "fcpxml":
        cut_fcpxml(args.input, cuts, args.output)
    elif args.format == "markers":
        cut_markers(args.input, cuts, args.output)


if __name__ == "__main__":
    main()

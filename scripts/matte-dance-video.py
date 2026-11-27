# Blueprint 081: alpha matte for the Dance Reel with Robust Video Matting (GPL-3.0, offline dev tool only).
# Usage: private/matte-venv/Scripts/python scripts/matte-dance-video.py [src] [outDir]
# → outDir/0001.png… (1-based, matching scripts/prepare-dance-video.mjs). Weights cache in private/torch-cache.
import os
import shutil
import sys

os.environ.setdefault("TORCH_HOME", os.path.join("private", "torch-cache"))

import torch  # noqa: E402

src = sys.argv[1] if len(sys.argv) > 1 else os.path.join("public", "dance-reel", "dance-vid.mp4")
out_dir = sys.argv[2] if len(sys.argv) > 2 else os.path.join("private", "dance-video-alpha")
raw_dir = out_dir + "-raw"

shutil.rmtree(raw_dir, ignore_errors=True)
shutil.rmtree(out_dir, ignore_errors=True)
os.makedirs(out_dir)

model = torch.hub.load("PeterL1n/RobustVideoMatting", "resnet50", trust_repo=True).eval()
convert_video = torch.hub.load("PeterL1n/RobustVideoMatting", "converter", trust_repo=True)

with torch.no_grad():
    convert_video(
        model,
        input_source=src,
        output_type="png_sequence",
        output_alpha=raw_dir,
        downsample_ratio=0.4,
        seq_chunk=1,
    )

frames = sorted(f for f in os.listdir(raw_dir) if f.endswith(".png"))
for i, name in enumerate(frames):
    os.replace(os.path.join(raw_dir, name), os.path.join(out_dir, f"{i + 1:04d}.png"))
shutil.rmtree(raw_dir, ignore_errors=True)
print(f"{len(frames)} alpha frames -> {out_dir}")

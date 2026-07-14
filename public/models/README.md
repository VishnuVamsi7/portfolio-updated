# Companion 3D model (optional)

By default the companion uses a built-in procedural robot — **no GLB required**.

To use a custom model, either:

**Option A — local file** (add to `.env` after placing the file):
```
NEXT_PUBLIC_COMPANION_MODEL_URL=/models/companion.glb
```
Then add: `public/models/companion.glb`

**Option B — remote URL:**
```
NEXT_PUBLIC_COMPANION_MODEL_URL=https://your-cdn.com/robot.glb
```

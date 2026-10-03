# Technical Workflow Guide: 4K Social Showcase Generation

This document details the engineering pipeline, browser automation flags, and image processing architecture used to generate 4K social media posts.

---

## 1. Prerequisites & Environment

### Dependencies
- **Python 3.9+** with the Pillow imaging library:
  ```bash
  pip install Pillow
  ```
- **Google Chrome / Chromium**:
  Verify Google Chrome is installed and accessible in the system path:
  ```bash
  google-chrome --version
  ```

### Production Server Mandate
Always run the target web application in production mode before capturing screenshots:
```bash
# Example for Next.js / React projects
pnpm build
pnpm start
```

**Why Development Mode Must Be Avoided**:
1. Development servers (`npm run dev`) inject hot-reloading icons (such as the Next.js floating indicator), error overlays, and developer telemetry bars into the rendered DOM.
2. In-flight TypeScript compilation in dev mode can cause race conditions during headless capture, resulting in half-loaded styles or flash of unstyled content (FOUC).
3. Production builds provide pre-rendered HTML, optimized font delivery, and pre-compressed static assets.

---

## 2. Headless Chrome Capture Flags

Headless Chrome requires specific command-line flags to guarantee full image hydration, font rasterization, and 2x Retina output.

```bash
google-chrome \
  --headless=new \
  --disable-gpu \
  --run-all-compositor-stages-before-draw \
  --virtual-time-budget=8000 \
  --force-device-scale-factor=2 \
  --window-size=1500,2200 \
  --screenshot=/tmp/output.png \
  http://localhost:3000/route
```

### Flag Explanations
- `--headless=new`: Uses the modern Chrome headless implementation, which has full parity with the desktop Chrome rendering engine (unlike the deprecated legacy `--headless`).
- `--run-all-compositor-stages-before-draw`: Forces Chrome to execute layout, paint, and rasterization passes before committing the screenshot. Without this flag, Next.js `<Image>` tags and dynamic font faces can appear as blank rectangles.
- `--virtual-time-budget=8000`: Advances the browser virtual clock by 8000ms instantly, allowing CSS transitions to settle, network requests to finish, and client-side hydration to complete before the capture is taken.
- `--force-device-scale-factor=2`: Renders the page at 2x pixel density. A `--window-size` of `1500,2000` will produce an output image of `3000 x 4000` pixels, providing true Retina sharpness on the 4K canvas without interpolation blur.

---

## 3. Hydration Techniques for Lazy-Loaded Images

Next.js `<Image>` components use native `loading="lazy"` by default. If a section is far down a long page (e.g. at `Y = 6000px`), Chromium's viewport observer will not trigger the image download unless the browser scrolls or the viewport covers the section.

### Strategies to Guarantee Hydration
1. **Window Size Calibration**: Set `--window-size` tall enough to include the target section, coupled with `--virtual-time-budget=8000`.
2. **Anchor Navigation**: Point the capture URL directly to the section anchor (e.g. `http://localhost:3000/#capsule-mixer`).
3. **Dedicated Route**: If a feature is on its own page (e.g. `/shop`, `/product/...`, `/materials`), navigate directly to that route.
4. **Pre-Rendered Image Verification**: In the capture script, verify that key pixels in the cropped image are not the default gray placeholder color (`#f5f5f7` or `(245, 245, 247)`).

---

## 4. Python Pillow Compositing Architecture

### Step 1: 4x Supersampled Alpha Mask
Standard anti-aliased drawing in PIL can suffer from 1-pixel jaggedness on high-contrast edges. The supersampling pipeline eliminates this:
```python
def create_smooth_mask(width, height, radius=64, supersample=4):
    sw, sh, sr = width * supersample, height * supersample, radius * supersample
    mask_large = Image.new("L", (sw, sh), 0)
    draw = ImageDraw.Draw(mask_large)
    draw.rounded_rectangle([0, 0, sw - 1, sh - 1], radius=sr, fill=255)
    return mask_large.resize((width, height), Image.Resampling.LANCZOS)
```

### Step 2: Multi-Layer Elevation Drop Shadow
A 3-layer Gaussian shadow creates realistic physical depth:
```python
# Layer 1: Contact shadow (tight ambient occlusion)
sdraw.rounded_rectangle([x, y + 16, x + cw, y + ch + 16], radius=radius, fill=(2, 6, 23, 75))

# Layer 2: Directional mid-elevation shadow
sdraw.rounded_rectangle([x, y + 42, x + cw, y + ch + 42], radius=radius, fill=(2, 8, 30, 55))

# Layer 3: Room atmosphere dispersion
sdraw.rounded_rectangle([x, y + 80, x + cw, y + ch + 80], radius=radius, fill=(5, 12, 38, 40))

# Blur the combined shadow
shadow_canvas = shadow_canvas.filter(ImageFilter.GaussianBlur(radius=54))
```

### Step 3: Specular Hairline Rim
Render a 4x supersampled stroke to cleanly separate the card edge against both dark and light backdrop gradients:
```python
sw, sh, sr = cw * 4, ch * 4, radius * 4
border_large = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))
bdraw = ImageDraw.Draw(border_large)
# Inner specular highlight (glass bevel effect)
bdraw.rounded_rectangle([2, 2, sw - 3, sh - 3], radius=sr - 2, outline=(255, 255, 255, 75), width=6)
# Outer crisp defining rim
bdraw.rounded_rectangle([0, 0, sw - 1, sh - 1], radius=sr, outline=(15, 23, 42, 30), width=4)
border = border_large.resize((cw, ch), Image.Resampling.LANCZOS)
```

---

## 5. Verification Checklist Before Publishing

Execute these checks after generating the assets:
1. **Resolution**: Inspect with `python -c "from PIL import Image; print(Image.open('path.png').size)"` — must output exactly `(3712, 4608)`.
2. **Minimalism**: Confirm zero external text labels, zero faux browser bars, zero window control dots, zero URL pills, and zero footer strips.
3. **Corner Smoothness**: Zoom in to 400% on card corners to verify smooth curvature with no stair-stepping.
4. **Hydration**: Confirm all model photography, product graphics, and interactive totalizers are populated with actual assets (no grey placeholders).
5. **No Emojis**: Confirm zero emoji characters across documentation, scripts, or commit history.

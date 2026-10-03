# Design Guidelines: Luxury Social Media Showcase Posts

This document specifies the visual philosophy, spatial mathematics, and rendering techniques required to generate consistent, ultra-high-end social media showcase shots.

---

## 1. Aesthetic Philosophy: Pure Minimalism

Traditional mockups often clutter the composition with artificial browser chrome (traffic light window dots, mock address bars, URL pills) and large text headers or category badges. In high-end digital luxury, this distracts from the craftsmanship of the website itself.

### Core Principles
- **No Faux Browser Chrome**: Never include fake Safari or Chrome window headers, red/yellow/green window controls, or domain URL pills (`brand.com`). The display card should represent a modern, bezel-less physical glass display.
- **No External Text Overlays**: Never place floating marketing headlines, category badges, or descriptive subtitles in the canvas margins outside the display card.
- **No Bottom Caption Bars**: Never add footer strips, metadata bars, or bottom tags.
- **Let the Product Speak**: The sole visual hero is the website interface, sitting gracefully on the 4K studio gradient.

---

## 2. Canvas Geometry & Proportions

The showcase template uses a vertical 4:5 aspect ratio, optimized for mobile feeds across Facebook, Instagram, LinkedIn, and X (Twitter).

- **Canvas Dimensions**: `3712 x 4608` pixels (4K vertical portrait).
- **Aspect Ratio**: ~1:1.241 (standard 4:5 social media post ratio).
- **Display Card Width**: `3000` pixels.
  - Horizontal margin: `(3712 - 3000) / 2 = 356` pixels on each side (~9.6% margin).
- **Display Card Height**: Dynamically matched to the section content (typically between `2400` and `3760` pixels).
  - Vertical centering: `y_offset = (4608 - card_height) // 2`.
  - Balanced vertical margin: between `424` and `1054` pixels, providing generous visual breathing room.

---

## 3. Subpixel Anti-Aliasing (4x Supersampling)

When high-contrast display cards (e.g. crisp white `#fbfbfd` against deep obsidian `#020617`) are rounded, standard rasterization produces single-pixel stair-stepping and jagged edges. To achieve completely smooth, hardware-grade rounded corners, the mask must be generated using 4x supersampling.

### Anti-Aliasing Algorithm
1. Define corner radius `R = 64` pixels.
2. Allocate a greyscale (`L` mode) buffer at 4x resolution:
   - Width: `W * 4` (e.g. `12000` pixels)
   - Height: `H * 4` (e.g. `10080` to `15040` pixels)
3. Draw the rounded rectangle on the 4x buffer with radius `R * 4 = 256` pixels.
4. Downsample the buffer back to `(W, H)` using `Image.Resampling.LANCZOS`.
5. Apply the downsampled buffer as the alpha channel of the card.

Result: Mathematically continuous 8-bit alpha transparency transitions along the circular arc, eliminating every trace of pixelation or aliasing.

---

## 4. Multi-Layer Elevation Drop Shadow

Flat or single-layer shadows look artificial and fail to convey true physical elevation. The floating display card uses a 3-layer Gaussian shadow architecture:

1. **Ambient Occlusion Contact Shadow**:
   - Offset: `y + 16` pixels
   - Color: Deep obsidian navy `(2, 6, 23, 75)`
   - Function: Simulates tight light obstruction directly behind the card.

2. **Mid Elevation Shadow**:
   - Offset: `y + 42` pixels
   - Color: Rich midnight navy `(2, 8, 30, 55)`
   - Function: Conveys directional studio light cast downward at an angle.

3. **Atmospheric Dispersion Shadow**:
   - Offset: `y + 80` pixels
   - Color: Soft luminous blue-indigo `(5, 12, 38, 40)`
   - Function: Spreads softly into the background gradient to provide room presence.

All three shadow layers are composited into a dedicated alpha buffer and filtered through a Gaussian blur with a radius of `54` pixels.

---

## 5. Dual-Pass Specular Hairline Rim

To ensure the display card separates cleanly from both the dark navy top of the cover image and the bright misty pearl bottom, a dual-pass anti-aliased hairline rim is drawn around the card perimeter:

1. **Outer Micro-Stroke**:
   - Width: `1.0` pixel
   - Color: `rgba(15, 23, 42, 0.12)`
   - Function: Defines the outer boundary against light or white sections of the background.

2. **Inner Specular Chamfer**:
   - Width: `1.5` pixels
   - Color: `rgba(255, 255, 255, 0.29)`
   - Function: Simulates an Apple-grade polished glass edge catching light against darker sections of the background.

Both passes are rendered at 4x supersampling resolution and downsampled with Lanczos interpolation.

---

## 6. Curating the 5-Shot Social Carousel

When publishing a multi-image carousel or album, each shot must showcase a distinct, high-impact dimension of the project:

1. **Shot 01: Flagship Storefront (Hero View)**
   - Top website navigation bar, primary brand headline, CTA buttons, and dual lookbook editorial imagery.
   - Clean whitespace below the editorial photos.

2. **Shot 02: Curated Catalog / Collection Grid**
   - Collection title, filter pills, and a complete grid of garments or products (e.g. all 12 pieces across 3 rows).
   - Uniform card heights and pricing tags visible.

3. **Shot 03: Interactive Studio / Configurator / Core Experience**
   - Scrolled or focused on the interactive centerpiece (e.g. outfit mixer, 3D viewer, live configurator).
   - Website navigation bar anchored at top, interactive selectors, dynamic totalizer or summary bar at bottom.

4. **Shot 04: Product Craft & Technical Detail Spec**
   - Individual product route showing high-resolution photography, variant selectors (size/color), spec rail (GSM, origin, fit), and tactile sensory or technical metric profile.

5. **Shot 05: Provenance, Materials & Brand Archive**
   - Brand ethos or materials page featuring certified natural fiber cards, mill origins, European textile certifications, and tactile close-ups.

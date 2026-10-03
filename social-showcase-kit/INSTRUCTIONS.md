# Social Showcase Kit: 4K Minimalist Social Media Post Generator

A portable, production-grade toolkit to generate high-resolution (4K), minimalist social media showcase shots for any website or web application.

---

## 1. Overview & Contents

This toolkit contains everything required to produce consistent, hardware-grade website showcase posts for Facebook, Instagram, LinkedIn, and X (Twitter) across any web project.

```text
social-showcase-kit/
├── INSTRUCTIONS.md           Master instructions and setup overview
├── README.md                 Quick reference copy of instructions
├── PROMPT_TEMPLATE.md        Ready-to-use prompt to paste to any AI assistant
├── DESIGN_GUIDELINES.md      Aesthetic principles, geometry, and shadow specs
├── TECHNICAL_WORKFLOW.md     Chrome flags, hydration rules, and Pillow architecture
├── generate_social_shots.py  Portable, fully configurable Python generator script
└── resources/
    ├── cover-background-4k.jpg                      3712 x 4608 4K studio backdrop
    └── Generated Image October 03, 2026 - 10_37AM.jpg Original upload alias
```

---

## 2. How to Use in Any Project (3 Steps)

### Step 1: Copy the Folder
Copy the `social-showcase-kit` directory into the root of your target project:
```bash
cp -r /path/to/social-showcase-kit /path/to/your-new-project/
```

### Step 2: Start Your Production Server
Ensure your project is compiled and running in production mode (NOT development mode):
```bash
# In your target project root:
pnpm build && pnpm start
# Verify the site is serving at http://localhost:3000
```

### Step 3: Run or Prompt
Choose either option:

- **Option A (Automated Script)**:
  Run the portable generation script:
  ```bash
  python3 social-showcase-kit/generate_social_shots.py --base-url http://localhost:3000
  ```

- **Option B (AI Assistant Delegation)**:
  Open `social-showcase-kit/PROMPT_TEMPLATE.md`, copy the prompt, and paste it to your AI coding assistant (Antigravity, Claude, ChatGPT, Cursor). The AI will read the guidelines, adapt the script to the project's unique routes, and generate all 5 showcase shots automatically.

---

## 3. The 5 Core Commandments

Every showcase shot produced with this kit must strictly obey these five rules:

1. **Pure Minimalist Composition**:
   Only two visual elements are permitted: the 4K gradient background and the centered floating website display card. Never add external headlines, category badges, decorative pill tags, or bottom caption bars.

2. **No Faux Browser Chrome**:
   Never include mock browser navigation bars, traffic light dots (red, yellow, green), or URL address pills (`blinc.design`). The display card represents a modern, borderless physical device screen showing the website itself.

3. **Subpixel Anti-Aliasing (Zero Pixelation)**:
   All card corner curves must be rendered using 4x supersampling (rendering the mask at 12000px+ resolution, downsampled via Lanczos interpolation). Edges must be silky smooth under high zoom.

4. **Realistic Multi-Layer Elevation**:
   Use a 3-stage diffuse Gaussian elevation shadow (ambient contact, directional mid-elevation, and room atmosphere dispersion) plus an anti-aliased hairline rim to create authentic physical depth.

5. **Production Build Requirement**:
   Screenshots must always be captured from a production build to eliminate hot-reload indicators, framework badges, or hydration debug overlays.

---

## 4. Customizing the Script for Other Projects

The generator script `social-showcase-kit/generate_social_shots.py` can be customized easily:

```python
# Configure in generate_social_shots.py or pass via CLI flags:
BASE_URL = "http://localhost:3000"
OUTPUT_DIR = "public/images/social-posts"

# Define your 5 showcase scenes:
SHOTS_CONFIG = [
    {"filename": "01-hero.png", "route": "/", "crop_y": (0, 2520)},
    {"filename": "02-catalog.png", "route": "/shop", "crop_y": (0, 3720)},
    {"filename": "03-feature.png", "route": "/#interactive", "crop_y": (0, 2540)},
    {"filename": "04-detail.png", "route": "/product/sample", "crop_y": (0, 3480)},
    {"filename": "05-about.png", "route": "/about", "crop_y": (0, 3440)},
]
```

---

## 5. Output Specifications

- **Canvas Size**: `3712 x 4608` pixels (4K vertical portrait, 4:5 ratio).
- **Format**: PNG with optimization enabled.
- **Card Width**: `3000` pixels (centered with 356px left/right margins).
- **Card Radius**: `64` pixels (4x supersampled).
- **Default Targets**: `public/images/social-posts/` and `docs/social-posts/`.

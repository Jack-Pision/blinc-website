# AI Prompt Template for Social Media Showcase Posts

Copy and paste the prompt below into any AI coding assistant (Antigravity, Claude, ChatGPT, Cursor, Copilot) when working in a new project where you have added the `social-showcase-kit` folder.

---

## Copy-Paste Prompt

```text
I have added the `social-showcase-kit` folder to this project repository.

Your task is to generate ultra-high-resolution, luxury social media showcase shots (for Facebook, Instagram, LinkedIn) of this website, using the 4K backdrop resource located at:
`social-showcase-kit/resources/cover-background-4k.jpg`

Follow all instructions in `social-showcase-kit/INSTRUCTIONS.md` and `social-showcase-kit/DESIGN_GUIDELINES.md`.

Critical Rules and Constraints:
1. Pure Minimalist Composition:
   - The final output must contain ONLY two visual elements: the 4K cover image background and the centered floating website display card.
   - Do NOT add any external headers, category pills, title text, subtitle descriptions, or decorative badges.
   - Do NOT add any faux browser chrome, window control buttons (red/yellow/green dots), or URL address bars (such as domain.com or url pills).
   - Do NOT add any bottom captions, footer strips, or external metadata labels.
   - The display card must show only the website interface itself, starting cleanly with the website navigation bar or section header.

2. Flawless 4K Visual Quality & Anti-Aliasing:
   - Output canvas dimensions must strictly match the cover image: 3712 x 4608 pixels (4:5 portrait ratio).
   - The display card width must be 3000px, horizontally centered with 356px margins on each side.
   - Display corners must use 4x supersampled anti-aliased masking (radius 64px, drawn at 4x resolution and downscaled using Lanczos filtering). Under no circumstances should the rounded corners appear pixelated, stair-stepped, or jagged.
   - Apply a multi-stage Gaussian elevation drop shadow (contact shadow, mid elevation, and diffuse room atmosphere) plus a subtle anti-aliased hairline rim to give the card physical glass elevation off the background.

3. Production Server Capture:
   - The website must be captured from a running production build (e.g. `npm run build && npm run start`), NEVER in development mode (`npm run dev`), so no development badges, hot-reload icons, or framework overlays appear.
   - Use Google Chrome headless with `--headless=new --run-all-compositor-stages-before-draw --force-device-scale-factor=2 --virtual-time-budget=8000` to capture crystal-clear 2x Retina assets.
   - Ensure all images on the page are fully loaded and hydrated (no grey skeleton boxes or unloaded placeholders).

4. Curate 5 Distinct Showcase Shots:
   - Shot 01: Flagship Storefront / Homepage Hero.
   - Shot 02: Catalog / Collection Grid (showing the product grid).
   - Shot 03: Interactive Feature / Configurator / Core Experience.
   - Shot 04: Product Detail View / Technical Craft Specs.
   - Shot 05: Brand Materials / Provenance / About Page.

5. Deliverables:
   - Save all generated PNG shots to `public/images/social-posts/` and `docs/social-posts/`.
   - Ensure zero emojis are used in code, scripts, commit messages, or responses.
   - Run linter verification to ensure zero errors.

Execute the generation script in `social-showcase-kit/generate_social_shots.py`, visually verify every generated image, and confirm when completed.
```

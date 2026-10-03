# Social Showcase Kit: 4K Minimalist Social Media Post Generator

A portable, production-grade toolkit to generate high-resolution (4K), minimalist social media showcase shots for any website or web application.

For complete documentation, see:
- [INSTRUCTIONS.md](file:///home/jack/Portfolio%20projects/Blinc/social-showcase-kit/INSTRUCTIONS.md): Setup overview, 3-step usage, and configuration
- [PROMPT_TEMPLATE.md](file:///home/jack/Portfolio%20projects/Blinc/social-showcase-kit/PROMPT_TEMPLATE.md): Ready-to-copy prompt for any AI assistant
- [DESIGN_GUIDELINES.md](file:///home/jack/Portfolio%20projects/Blinc/social-showcase-kit/DESIGN_GUIDELINES.md): Spatial mathematics, 4x supersampling, and shadow architecture
- [TECHNICAL_WORKFLOW.md](file:///home/jack/Portfolio%20projects/Blinc/social-showcase-kit/TECHNICAL_WORKFLOW.md): Headless Chrome flags and Pillow pipeline

---

## Quick Start

1. Start your production server on `http://localhost:3000`:
   ```bash
   pnpm build && pnpm start
   ```

2. Run the generator script:
   ```bash
   python3 social-showcase-kit/generate_social_shots.py --base-url http://localhost:3000
   ```

3. Collect the generated 4K posts from `public/images/social-posts/` and `docs/social-posts/`.

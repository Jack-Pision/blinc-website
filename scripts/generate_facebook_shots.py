import os
import subprocess
from PIL import Image

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COVER_BG = os.path.join(BASE_DIR, "public/images/Serene Navy to Icy Blue Gradient.png")
SCREENS_DIR = "/tmp/blinc_facebook_screens"
OUTPUT_PUBLIC = os.path.join(BASE_DIR, "public/images/social-posts")
OUTPUT_DOCS = os.path.join(BASE_DIR, "docs/social-posts")

os.makedirs(OUTPUT_PUBLIC, exist_ok=True)
os.makedirs(OUTPUT_DOCS, exist_ok=True)
os.makedirs(SCREENS_DIR, exist_ok=True)

print("Step 1: Capturing clean website sections from production server (http://localhost:3000)...")

# 1. Homepage Capture for Hero & Mixer
subprocess.run([
    "google-chrome", "--headless", "--disable-gpu",
    "--virtual-time-budget=5000",
    "--window-size=1440,4300",
    "--screenshot=/tmp/fb_home_raw.png",
    "http://localhost:3000"
], check=True)
home_im = Image.open("/tmp/fb_home_raw.png")

# Screen 01: Hero (0 to 1180)
s1 = home_im.crop((0, 0, 1440, 1180))
s1.save(os.path.join(SCREENS_DIR, "screen_01_hero.png"))

# Screen 03: Mixer (2860 to 3950)
s3 = home_im.crop((0, 2860, 1440, 3950))
s3.save(os.path.join(SCREENS_DIR, "screen_03_mixer.png"))

# 2. Shop Page Capture for Capsule Grid
subprocess.run([
    "google-chrome", "--headless", "--disable-gpu",
    "--virtual-time-budget=5000",
    "--window-size=1440,1800",
    "--screenshot=/tmp/fb_shop_raw.png",
    "http://localhost:3000/shop"
], check=True)
shop_im = Image.open("/tmp/fb_shop_raw.png")
s2 = shop_im.crop((0, 0, 1440, 1260))
s2.save(os.path.join(SCREENS_DIR, "screen_02_grid.png"))

# 3. Product Detail Page Capture
subprocess.run([
    "google-chrome", "--headless", "--disable-gpu",
    "--virtual-time-budget=4000",
    "--window-size=1440,1400",
    "--screenshot=/tmp/fb_prod_raw.png",
    "http://localhost:3000/product/deconstructed-oversized-wool-blazer"
], check=True)
prod_im = Image.open("/tmp/fb_prod_raw.png")
s4 = prod_im.crop((0, 0, 1440, 1180))
s4.save(os.path.join(SCREENS_DIR, "screen_04_product.png"))

# 4. Materials Page Capture
subprocess.run([
    "google-chrome", "--headless", "--disable-gpu",
    "--virtual-time-budget=4000",
    "--window-size=1440,1400",
    "--screenshot=/tmp/fb_mat_raw.png",
    "http://localhost:3000/materials"
], check=True)
mat_im = Image.open("/tmp/fb_mat_raw.png")
s5 = mat_im.crop((0, 0, 1440, 1220))
s5.save(os.path.join(SCREENS_DIR, "screen_05_materials.png"))

print("Step 2: Defining Facebook post compositions...")

SHOTS = [
    {
        "filename": "01-flagship-storefront.png",
        "tag": "BLINC · CONCEPT WARDROBE 2026",
        "title": "Architectural Tailoring & Knitwear",
        "subtitle": "Twelve pieces. Built for modern life. Editorial flagship showcase.",
        "url": "blinc.design",
        "screen": os.path.join(SCREENS_DIR, "screen_01_hero.png"),
        "footer_left": "Lookbook 01 & 02 · Natural Fibers & Architectural Proportions",
        "footer_right": "blinc.design",
    },
    {
        "filename": "02-capsule-collection.png",
        "tag": "CURATED CATALOG · 12 GARMENTS",
        "title": "The 2026 Capsule Collection",
        "subtitle": "Gender-transcendent wardrobe engineered across modular proportions.",
        "url": "blinc.design/shop",
        "screen": os.path.join(SCREENS_DIR, "screen_02_grid.png"),
        "footer_left": "Women · Men · Unisex · 135 to 790 GSM Fabric Densities",
        "footer_right": "blinc.design/shop",
    },
    {
        "filename": "03-interactive-silhouette-lab.png",
        "tag": "MODULAR STYLING LAB · LIVE INTERACTION",
        "title": "Interactive Silhouette Lab",
        "subtitle": "Real-time 3-piece outfit builder with live palette harmony & pricing.",
        "url": "blinc.design#silhouette-lab",
        "screen": os.path.join(SCREENS_DIR, "screen_03_mixer.png"),
        "footer_left": "Complete Ensemble Totalizer · Instant Silhouette Bundle Addition",
        "footer_right": "blinc.design",
    },
    {
        "filename": "04-product-craft-spec.png",
        "tag": "TACTILE CRAFTSMANSHIP · SPEC RAIL",
        "title": "Deconstructed Wool Blazer",
        "subtitle": "380 GSM Virgin Italian Wool tailored in Biella with floating canvas.",
        "url": "blinc.design/product/deconstructed-oversized-wool-blazer",
        "screen": os.path.join(SCREENS_DIR, "screen_04_product.png"),
        "footer_left": "2.8x Fabric Weave Zoom · Boxy Architectural Fit · RWS Certified",
        "footer_right": "blinc.design/product",
    },
    {
        "filename": "05-textile-provenance.png",
        "tag": "TRACEABLE TEXTILES · EUROPEAN MILLS",
        "title": "Materials & Craft Archive",
        "subtitle": "Certified natural fibers: Italian Virgin Wool, Sandwashed Silk, and Baby Mohair.",
        "url": "blinc.design/materials",
        "screen": os.path.join(SCREENS_DIR, "screen_05_materials.png"),
        "footer_left": "Responsible Wool Standard · OEKO-TEX Standard 100 · REACH Compliant",
        "footer_right": "blinc.design/materials",
    },
]

print("Step 3: Rendering creative showcase shots onto the gradient cover image...")

for idx, shot in enumerate(SHOTS, start=1):
    html_content = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{
    width: 1122px;
    height: 1402px;
    background-image: url("file://{COVER_BG}");
    background-size: cover;
    background-position: center;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, sans-serif;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 56px 64px 44px 64px;
    overflow: hidden;
  }}
  .header {{
    max-width: 920px;
  }}
  .tag-badge {{
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 6px 14px;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.14);
    border: 1px solid rgba(255, 255, 255, 0.28);
    backdrop-filter: blur(16px);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #f1f5f9;
    margin-bottom: 12px;
  }}
  .tag-dot {{
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #60a5fa;
  }}
  .title {{
    font-size: 34px;
    font-weight: 700;
    letter-spacing: -0.025em;
    line-height: 1.12;
    color: #ffffff;
    margin-bottom: 8px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
  }}
  .subtitle {{
    font-size: 14px;
    font-weight: 400;
    line-height: 1.4;
    color: rgba(255, 255, 255, 0.82);
    letter-spacing: -0.01em;
  }}
  .mockup-wrapper {{
    width: 100%;
    display: flex;
    justify-content: center;
    margin: auto 0;
  }}
  .browser-mockup {{
    width: 994px;
    background: #ffffff;
    border-radius: 18px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.35);
    box-shadow: 
      0 40px 100px -20px rgba(2, 6, 23, 0.72),
      0 18px 40px -10px rgba(0, 0, 0, 0.38),
      0 0 0 1px rgba(255, 255, 255, 0.22);
    display: flex;
    flex-direction: column;
  }}
  .browser-bar {{
    height: 38px;
    background: #fbfbfd;
    border-bottom: 1px solid #e5e5ea;
    display: flex;
    align-items: center;
    padding: 0 16px;
    position: relative;
    user-select: none;
  }}
  .dots {{
    display: flex;
    gap: 7px;
  }}
  .dot {{
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }}
  .dot-red {{ background: #ff5f56; border: 1px solid #e0443e; }}
  .dot-yellow {{ background: #ffbd2e; border: 1px solid #dea123; }}
  .dot-green {{ background: #27c93f; border: 1px solid #1aab29; }}
  .url-bar {{
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    background: #efeff2;
    padding: 4px 18px;
    border-radius: 6px;
    font-size: 11px;
    color: #64748b;
    font-weight: 500;
    letter-spacing: 0.02em;
    display: flex;
    align-items: center;
    gap: 6px;
    border: 1px solid #e2e8f0;
  }}
  .screenshot-container {{
    width: 100%;
    background: #fbfbfd;
    line-height: 0;
  }}
  .screenshot-container img {{
    width: 100%;
    height: auto;
    display: block;
  }}
  .footer-strip {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    font-weight: 600;
    color: #0f172a;
    letter-spacing: 0.02em;
    padding: 0 4px;
  }}
  .footer-strip .pill {{
    display: inline-block;
    padding: 4px 12px;
    background: rgba(15, 23, 42, 0.08);
    border-radius: 9999px;
    font-size: 11px;
    font-weight: 600;
    color: #1e293b;
    letter-spacing: 0.04em;
  }}
</style>
</head>
<body>
  <div class="header">
    <div class="tag-badge">
      <span class="tag-dot"></span>
      <span>{shot["tag"]}</span>
    </div>
    <div class="title">{shot["title"]}</div>
    <div class="subtitle">{shot["subtitle"]}</div>
  </div>

  <div class="mockup-wrapper">
    <div class="browser-mockup">
      <div class="browser-bar">
        <div class="dots">
          <div class="dot dot-red"></div>
          <div class="dot dot-yellow"></div>
          <div class="dot dot-green"></div>
        </div>
        <div class="url-bar">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span>{shot["url"]}</span>
        </div>
      </div>
      <div class="screenshot-container">
        <img src="file://{shot['screen']}" />
      </div>
    </div>
  </div>

  <div class="footer-strip">
    <span>{shot["footer_left"]}</span>
    <span class="pill">{shot["footer_right"]}</span>
  </div>
</body>
</html>
"""
    tmp_html = f"/tmp/shot_{idx}.html"
    with open(tmp_html, "w", encoding="utf-8") as f:
        f.write(html_content)

    out_pub = os.path.join(OUTPUT_PUBLIC, shot["filename"])
    out_docs = os.path.join(OUTPUT_DOCS, shot["filename"])

    cmd = [
        "google-chrome",
        "--headless",
        "--disable-gpu",
        "--window-size=1122,1402",
        f"--screenshot={out_pub}",
        f"file://{tmp_html}"
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    
    # Also copy to docs/social-posts
    subprocess.run(["cp", out_pub, out_docs], check=True)
    print(f"Generated Shot {idx}: {shot['filename']}")

print("All 5 Facebook showcase shots generated successfully.")

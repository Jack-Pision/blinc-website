import subprocess
import os
from PIL import Image

OUTPUT_DIR = "docs/screenshots"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def capture_page(url, out_path, width=1440, height=2000, wait_ms=3000):
    cmd = [
        "google-chrome",
        "--headless",
        "--disable-gpu",
        f"--virtual-time-budget={wait_ms}",
        f"--window-size={width},{height}",
        f"--screenshot={out_path}",
        url
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

print("Capturing 2026 luxury design screenshots...")

# 1. Homepage Full Height Capture for Section Crops
print("Capturing homepage canvas...")
capture_page("http://localhost:3000", "/tmp/blinc_home_full.png", width=1440, height=4300, wait_ms=3000)
home_img = Image.open("/tmp/blinc_home_full.png")

# 01-homepage-hero.png
print("Generating 01-homepage-hero.png...")
hero_crop = home_img.crop((0, 0, 1440, 1180))
hero_crop.save(f"{OUTPUT_DIR}/01-homepage-hero.png")

# 02-capsule-collection.png
print("Generating 02-capsule-collection.png...")
capsule_crop = home_img.crop((0, 1271, 1440, 2855))
capsule_crop.save(f"{OUTPUT_DIR}/02-capsule-collection.png")

# 03-capsule-mixer.png
print("Generating 03-capsule-mixer.png...")
mixer_crop = home_img.crop((0, 2861, 1440, 3950))
mixer_crop.save(f"{OUTPUT_DIR}/03-capsule-mixer.png")

# 08-footer-watermark.png
print("Generating 08-footer-watermark.png...")
footer_crop = home_img.crop((0, 4100, 1440, 4300))
footer_crop.save(f"{OUTPUT_DIR}/08-footer-watermark.png")

# 04-catalog-shop.png (Hydrated Shop page)
print("Generating 04-catalog-shop.png...")
capture_page("http://localhost:3000/shop", f"{OUTPUT_DIR}/04-catalog-shop.png", width=1440, height=1850, wait_ms=4000)

# 05-product-detail.png (Product Detail view)
print("Generating 05-product-detail.png...")
capture_page("http://localhost:3000/product/deconstructed-oversized-wool-blazer", "/tmp/blinc_prod_full.png", width=1440, height=1350, wait_ms=3000)
prod_img = Image.open("/tmp/blinc_prod_full.png")
prod_crop = prod_img.crop((0, 0, 1440, 1200))
prod_crop.save(f"{OUTPUT_DIR}/05-product-detail.png")

# 06-materials-craft.png (Textile library)
print("Generating 06-materials-craft.png...")
capture_page("http://localhost:3000/materials", "/tmp/blinc_mat_full.png", width=1440, height=1400, wait_ms=3000)
mat_img = Image.open("/tmp/blinc_mat_full.png")
mat_crop = mat_img.crop((0, 0, 1440, 1250))
mat_crop.save(f"{OUTPUT_DIR}/06-materials-craft.png")

# 07-brand-philosophy.png (Philosophy atelier)
print("Generating 07-brand-philosophy.png...")
capture_page("http://localhost:3000/philosophy", "/tmp/blinc_phil_full.png", width=1440, height=1300, wait_ms=3000)
phil_img = Image.open("/tmp/blinc_phil_full.png")
phil_crop = phil_img.crop((0, 0, 1440, 1150))
phil_crop.save(f"{OUTPUT_DIR}/07-brand-philosophy.png")

print("All 8 presentation screenshots captured and processed successfully.")

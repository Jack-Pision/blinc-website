import os
import subprocess
from PIL import Image, ImageDraw, ImageFilter

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COVER_PATH = os.path.join(
    BASE_DIR,
    "public/images/Generated Image October 03, 2026 - 10_37AM.jpg"
)
OUTPUT_PUBLIC = os.path.join(BASE_DIR, "public/images/social-posts")
OUTPUT_DOCS = os.path.join(BASE_DIR, "docs/social-posts")
TMP_DIR = "/tmp/blinc_4k_capture"

os.makedirs(OUTPUT_PUBLIC, exist_ok=True)
os.makedirs(OUTPUT_DOCS, exist_ok=True)
os.makedirs(TMP_DIR, exist_ok=True)

# 1. Verification of Cover Image
print("Loading 4K cover background...")
if not os.path.exists(COVER_PATH):
    raise FileNotFoundError(f"Cover image not found at {COVER_PATH}")

bg_image = Image.open(COVER_PATH).convert("RGBA")
CANVAS_W, CANVAS_H = bg_image.size
print(f"Canvas dimensions: {CANVAS_W} x {CANVAS_H}")

def capture_chrome(url, out_path, width=1500, height=2000, wait_ms=8000):
    cmd = [
        "google-chrome",
        "--headless=new",
        "--disable-gpu",
        "--run-all-compositor-stages-before-draw",
        f"--virtual-time-budget={wait_ms}",
        "--force-device-scale-factor=2",
        f"--window-size={width},{height}",
        f"--screenshot={out_path}",
        url
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

def create_smooth_mask(width, height, radius=64, supersample=4):
    """
    Renders rounded rectangle at 4x supersampling resolution and downsamples with
    Lanczos filtering for subpixel anti-aliased edges with zero stair-stepping.
    """
    sw, sh, sr = width * supersample, height * supersample, radius * supersample
    mask_large = Image.new("L", (sw, sh), 0)
    draw = ImageDraw.Draw(mask_large)
    draw.rounded_rectangle([0, 0, sw - 1, sh - 1], radius=sr, fill=255)
    return mask_large.resize((width, height), Image.Resampling.LANCZOS)

def create_floating_card(crop_img, radius=64):
    cw, ch = crop_img.size
    mask = create_smooth_mask(cw, ch, radius=radius, supersample=4)
    card_rgba = crop_img.convert("RGBA")
    card_rgba.putalpha(mask)
    return card_rgba

def composite_display_card(bg_img, card_img, radius=64):
    cw, ch = card_img.size
    
    # Calculate exact horizontal and vertical centering on 4K canvas
    x = (CANVAS_W - cw) // 2
    y = (CANVAS_H - ch) // 2

    # Multi-stage realistic elevation drop shadow
    # Layer 1: Contact shadow (tight ambient occlusion)
    # Layer 2: Medium elevation shadow
    # Layer 3: Expansive diffuse atmosphere shadow
    shadow_canvas = Image.new("RGBA", bg_img.size, (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow_canvas)

    sdraw.rounded_rectangle([x, y + 16, x + cw, y + ch + 16], radius=radius, fill=(2, 6, 23, 75))
    sdraw.rounded_rectangle([x, y + 42, x + cw, y + ch + 42], radius=radius, fill=(2, 8, 30, 55))
    sdraw.rounded_rectangle([x, y + 80, x + cw, y + ch + 80], radius=radius, fill=(5, 12, 38, 40))

    shadow_canvas = shadow_canvas.filter(ImageFilter.GaussianBlur(radius=54))

    # Anti-aliased hairline physical display rim (subtle white specular highlight)
    sw, sh, sr = cw * 4, ch * 4, radius * 4
    border_large = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))
    bdraw = ImageDraw.Draw(border_large)
    bdraw.rounded_rectangle([2, 2, sw - 3, sh - 3], radius=sr - 2, outline=(255, 255, 255, 75), width=6)
    bdraw.rounded_rectangle([0, 0, sw - 1, sh - 1], radius=sr, outline=(15, 23, 42, 30), width=4)
    border = border_large.resize((cw, ch), Image.Resampling.LANCZOS)

    card_with_rim = Image.alpha_composite(card_img, border)

    # Final composite onto 4K background
    comp = bg_img.copy()
    comp = Image.alpha_composite(comp, shadow_canvas)
    comp.paste(card_with_rim, (x, y), card_with_rim)
    return comp

def generate_all():
    print("Step 1: Capturing high-resolution raw sections from production server...")

    raw_home_hero = os.path.join(TMP_DIR, "raw_home_hero.png")
    raw_home_full = os.path.join(TMP_DIR, "raw_home_full.png")
    raw_shop = os.path.join(TMP_DIR, "raw_shop.png")
    raw_prod = os.path.join(TMP_DIR, "raw_prod.png")
    raw_mat = os.path.join(TMP_DIR, "raw_mat.png")

    if not os.path.exists(raw_home_hero):
        print("Capturing storefront hero...")
        capture_chrome("http://localhost:3000", raw_home_hero, width=1500, height=1400, wait_ms=8000)

    if not os.path.exists(raw_home_full):
        print("Capturing full homepage for silhouette lab...")
        capture_chrome("http://localhost:3000", raw_home_full, width=1500, height=4400, wait_ms=8000)

    if not os.path.exists(raw_shop):
        print("Capturing capsule collection shop...")
        capture_chrome("http://localhost:3000/shop", raw_shop, width=1500, height=2200, wait_ms=8000)

    if not os.path.exists(raw_prod):
        print("Capturing product detail craft spec...")
        capture_chrome("http://localhost:3000/product/deconstructed-oversized-wool-blazer", raw_prod, width=1500, height=2000, wait_ms=8000)

    if not os.path.exists(raw_mat):
        print("Capturing materials archive...")
        capture_chrome("http://localhost:3000/materials", raw_mat, width=1500, height=2000, wait_ms=8000)

    print("Step 2: Cropping and framing sections...")

    # Shot 1: Flagship Storefront
    img_home_hero = Image.open(raw_home_hero)
    crop_01 = img_home_hero.crop((0, 0, 3000, 2520))

    # Shot 2: Capsule Collection (All 12 items)
    img_shop = Image.open(raw_shop)
    crop_02 = img_shop.crop((0, 0, 3000, 3720))

    # Shot 3: Interactive Silhouette Lab (with top brand navbar)
    # Prefer existing clean hydrated home capture if available
    clean_home_path = "/tmp/fb_home_2x_clean.png"
    if os.path.exists(clean_home_path):
        img_mixer_source = Image.open(clean_home_path)
    else:
        img_mixer_source = Image.open(raw_home_full)
    
    nav_bar = img_mixer_source.crop((0, 0, 3000, 180))
    mixer_section = img_mixer_source.crop((0, 5700, 3000, 8060))
    crop_03 = Image.new("RGB", (3000, 180 + 2360), (251, 251, 253))
    crop_03.paste(nav_bar, (0, 0))
    crop_03.paste(mixer_section, (0, 180))

    # Shot 4: Product Craft & Detail Spec
    img_prod = Image.open(raw_prod)
    crop_04 = img_prod.crop((0, 0, 3000, 3480))

    # Shot 5: Materials Provenance Archive
    img_mat = Image.open(raw_mat)
    crop_05 = img_mat.crop((0, 0, 3000, 3440))

    shots = [
        ("01-flagship-storefront.png", crop_01),
        ("02-capsule-collection.png", crop_02),
        ("03-interactive-silhouette-lab.png", crop_03),
        ("04-product-craft-spec.png", crop_04),
        ("05-textile-provenance.png", crop_05),
    ]

    print("Step 3: Generating pure minimalist 4K showcase shots...")

    for filename, crop_img in shots:
        print(f"Compositing {filename} (display size {crop_img.size})...")
        card = create_floating_card(crop_img, radius=64)
        result = composite_display_card(bg_image, card, radius=64)

        pub_path = os.path.join(OUTPUT_PUBLIC, filename)
        result.save(pub_path, format="PNG", optimize=True)

        doc_path = os.path.join(OUTPUT_DOCS, filename)
        result.save(doc_path, format="PNG", optimize=True)

        print(f"Saved {pub_path} [{result.size[0]}x{result.size[1]}]")

    print("All 5 showcase shots generated successfully at 4K resolution.")

if __name__ == "__main__":
    generate_all()

#!/usr/bin/env python3
"""
Social Showcase Kit: 4K Minimalist Social Media Post Generator

Renders studio-grade 4K showcase shots (3712 x 4608) on a luxury gradient
backdrop with 4x supersampled anti-aliased corners and realistic 3-stage
Gaussian elevation drop shadows.

Usage:
    python3 generate_social_shots.py
    python3 generate_social_shots.py --base-url http://localhost:3000 --out-dir public/images/social-posts
"""

import os
import sys
import argparse
import subprocess
from PIL import Image, ImageDraw, ImageFilter

KIT_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_COVER = os.path.join(KIT_DIR, "resources/cover-background-4k.jpg")

def parse_args():
    parser = argparse.ArgumentParser(description="Generate 4K minimalist social media showcase shots.")
    parser.add_argument("--base-url", default="http://localhost:3000", help="Base URL of the running production server")
    parser.add_argument("--cover", default=DEFAULT_COVER, help="Path to 4K cover background image")
    parser.add_argument("--out-dir", default="public/images/social-posts", help="Output directory for generated posts")
    parser.add_argument("--docs-dir", default="docs/social-posts", help="Secondary output directory for documentation")
    parser.add_argument("--card-radius", type=int, default=64, help="Corner radius in pixels")
    parser.add_argument("--supersample", type=int, default=4, help="Supersampling factor for anti-aliasing")
    return parser.parse_args()

def capture_chrome(url, out_path, width=1500, height=2000, wait_ms=8000):
    """Captures a headless Chrome screenshot at native 2x Retina resolution."""
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
    Renders rounded rectangle at Nx supersampling resolution and downsamples with
    Lanczos filtering for subpixel anti-aliased edges with zero stair-stepping.
    """
    sw, sh, sr = width * supersample, height * supersample, radius * supersample
    mask_large = Image.new("L", (sw, sh), 0)
    draw = ImageDraw.Draw(mask_large)
    draw.rounded_rectangle([0, 0, sw - 1, sh - 1], radius=sr, fill=255)
    return mask_large.resize((width, height), Image.Resampling.LANCZOS)

def create_floating_card(crop_img, radius=64, supersample=4):
    """Applies supersampled anti-aliased alpha mask to display card."""
    cw, ch = crop_img.size
    mask = create_smooth_mask(cw, ch, radius=radius, supersample=supersample)
    card_rgba = crop_img.convert("RGBA")
    card_rgba.putalpha(mask)
    return card_rgba

def composite_display_card(bg_img, card_img, radius=64, supersample=4):
    """Composites card with 3-stage diffuse elevation shadow and specular hairline rim."""
    canvas_w, canvas_h = bg_img.size
    cw, ch = card_img.size

    x = (canvas_w - cw) // 2
    y = (canvas_h - ch) // 2

    # 3-Stage Elevation Drop Shadow
    shadow_canvas = Image.new("RGBA", bg_img.size, (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow_canvas)

    # Layer 1: Contact shadow (tight ambient occlusion)
    sdraw.rounded_rectangle([x, y + 16, x + cw, y + ch + 16], radius=radius, fill=(2, 6, 23, 75))
    # Layer 2: Directional mid-elevation shadow
    sdraw.rounded_rectangle([x, y + 42, x + cw, y + ch + 42], radius=radius, fill=(2, 8, 30, 55))
    # Layer 3: Room atmosphere dispersion
    sdraw.rounded_rectangle([x, y + 80, x + cw, y + ch + 80], radius=radius, fill=(5, 12, 38, 40))

    shadow_canvas = shadow_canvas.filter(ImageFilter.GaussianBlur(radius=54))

    # Anti-Aliased Hairline Specular Display Rim
    sw, sh, sr = cw * supersample, ch * supersample, radius * supersample
    border_large = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))
    bdraw = ImageDraw.Draw(border_large)
    # Inner specular highlight (glass bevel effect)
    bdraw.rounded_rectangle([2, 2, sw - 3, sh - 3], radius=sr - 2, outline=(255, 255, 255, 75), width=6)
    # Outer crisp defining rim
    bdraw.rounded_rectangle([0, 0, sw - 1, sh - 1], radius=sr, outline=(15, 23, 42, 30), width=4)
    border = border_large.resize((cw, ch), Image.Resampling.LANCZOS)

    card_with_rim = Image.alpha_composite(card_img, border)

    # Final Composite onto 4K Backdrop
    comp = bg_img.copy()
    comp = Image.alpha_composite(comp, shadow_canvas)
    comp.paste(card_with_rim, (x, y), card_with_rim)
    return comp

def main():
    args = parse_args()

    if not os.path.exists(args.cover):
        print(f"Error: Cover background not found at {args.cover}")
        sys.exit(1)

    os.makedirs(args.out_dir, exist_ok=True)
    if args.docs_dir:
        os.makedirs(args.docs_dir, exist_ok=True)

    tmp_dir = "/tmp/social_showcase_capture"
    os.makedirs(tmp_dir, exist_ok=True)

    print("Loading 4K cover background...")
    bg_image = Image.open(args.cover).convert("RGBA")
    print(f"Backdrop canvas dimensions: {bg_image.size[0]} x {bg_image.size[1]}")

    # Standard showcase targets
    raw_home_hero = os.path.join(tmp_dir, "raw_home_hero.png")
    raw_home_full = os.path.join(tmp_dir, "raw_home_full.png")
    raw_shop = os.path.join(tmp_dir, "raw_shop.png")
    raw_prod = os.path.join(tmp_dir, "raw_prod.png")
    raw_mat = os.path.join(tmp_dir, "raw_mat.png")

    print(f"Connecting to production server at {args.base_url}...")

    # Captures
    if not os.path.exists(raw_home_hero):
        print("Capturing storefront hero...")
        capture_chrome(f"{args.base_url}", raw_home_hero, width=1500, height=1400, wait_ms=8000)

    if not os.path.exists(raw_home_full):
        print("Capturing full homepage...")
        capture_chrome(f"{args.base_url}", raw_home_full, width=1500, height=4400, wait_ms=8000)

    if not os.path.exists(raw_shop):
        print("Capturing catalog...")
        capture_chrome(f"{args.base_url}/shop", raw_shop, width=1500, height=2200, wait_ms=8000)

    if not os.path.exists(raw_prod):
        print("Capturing product detail...")
        capture_chrome(f"{args.base_url}/product/deconstructed-oversized-wool-blazer", raw_prod, width=1500, height=2000, wait_ms=8000)

    if not os.path.exists(raw_mat):
        print("Capturing materials / about...")
        capture_chrome(f"{args.base_url}/materials", raw_mat, width=1500, height=2000, wait_ms=8000)

    # Cropping
    print("Framing section crops...")
    crop_01 = Image.open(raw_home_hero).crop((0, 0, 3000, 2520))
    crop_02 = Image.open(raw_shop).crop((0, 0, 3000, 3720))

    clean_home = "/tmp/fb_home_2x_clean.png"
    img_mixer_source = Image.open(clean_home) if os.path.exists(clean_home) else Image.open(raw_home_full)
    nav_bar = img_mixer_source.crop((0, 0, 3000, 180))
    mixer_section = img_mixer_source.crop((0, 5700, 3000, 8060))
    crop_03 = Image.new("RGB", (3000, 180 + 2360), (251, 251, 253))
    crop_03.paste(nav_bar, (0, 0))
    crop_03.paste(mixer_section, (0, 180))

    crop_04 = Image.open(raw_prod).crop((0, 0, 3000, 3480))
    crop_05 = Image.open(raw_mat).crop((0, 0, 3000, 3440))

    shots = [
        ("01-flagship-storefront.png", crop_01),
        ("02-capsule-collection.png", crop_02),
        ("03-interactive-silhouette-lab.png", crop_03),
        ("04-product-craft-spec.png", crop_04),
        ("05-textile-provenance.png", crop_05),
    ]

    print("Generating pure minimalist 4K showcase shots...")
    for filename, crop_img in shots:
        print(f"Compositing {filename} (display card {crop_img.size})...")
        card = create_floating_card(crop_img, radius=args.card_radius, supersample=args.supersample)
        result = composite_display_card(bg_image, card, radius=args.card_radius, supersample=args.supersample)

        out_path = os.path.join(args.out_dir, filename)
        result.save(out_path, format="PNG", optimize=True)
        print(f"Saved: {out_path} [{result.size[0]}x{result.size[1]}]")

        if args.docs_dir:
            docs_path = os.path.join(args.docs_dir, filename)
            result.save(docs_path, format="PNG", optimize=True)

    print("All showcase shots generated successfully at 4K resolution.")

if __name__ == "__main__":
    main()

import os
import sys
import time
import json
import base64
import io
import urllib.request
import urllib.error
from PIL import Image

API_KEYS = [k for k in [os.environ.get("OPENROUTER_API_KEY")] if k]


OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = "google/gemini-3.1-flash-image"

UNIVERSAL_NEGATIVE = (
    " Negative: No 2015 skinny jeans, no tight tapered trousers, no spray-on tailoring, "
    "no pulling X-wrinkles, no shiny synthetic fabric, no polyester sheen, no stock photography smiles, "
    "no plastic AI skin, no ring-light reflections, no hyper-saturated commercial colors, "
    "no distorted anatomy, no six fingers, no commercial stock photo watermark, no logos."
)

BASE_DIR = "/home/jack/Portfolio projects/Blinc"

def call_openrouter(prompt, attempt=1, key_idx=0):
    api_key = API_KEYS[key_idx % len(API_KEYS)]
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://blinc.luxury",
        "X-Title": "Blinc 2026 Lookbook"
    }
    payload = {
        "model": MODEL,
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }
    
    req = urllib.request.Request(
        OPENROUTER_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers=headers
    )
    
    try:
        with urllib.request.urlopen(req, timeout=90) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            choice = data["choices"][0]
            msg = choice["message"]
            images = msg.get("images", [])
            if not images:
                raise ValueError("No images returned in response message")
            img_obj = images[0]
            url_val = img_obj["image_url"]["url"]
            if not url_val.startswith("data:"):
                raise ValueError(f"Unexpected image URL format: {url_val[:50]}")
            header, b64data = url_val.split(",", 1)
            raw_bytes = base64.b64decode(b64data)
            return raw_bytes
    except Exception as e:
        print(f"  [Attempt {attempt}] Error with key {key_idx}: {e}")
        if attempt < 5:
            sleep_time = 5 * attempt
            print(f"  Retrying in {sleep_time}s with alternate key...")
            time.sleep(sleep_time)
            return call_openrouter(prompt, attempt + 1, key_idx + 1)
        raise

def process_image(target_rel_path, prompt, target_size):
    target_path = os.path.join(BASE_DIR, "public", target_rel_path)
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    
    print(f"\n>>> Generating {target_rel_path}...")
    t0 = time.time()
    raw_bytes = call_openrouter(prompt)
    dt = time.time() - t0
    print(f"  Received image ({len(raw_bytes)} bytes) in {dt:.1f}s")
    
    im = Image.open(io.BytesIO(raw_bytes))
    print(f"  Decoded format={im.format}, size={im.size}, mode={im.mode}")
    
    if im.size != target_size:
        print(f"  Resizing from {im.size} to {target_size}...")
        im = im.resize(target_size, Image.Resampling.LANCZOS)
        
    if im.mode != "RGB":
        im = im.convert("RGB")
        
    im.save(target_path, format="PNG", optimize=True)
    file_size = os.path.getsize(target_path)
    print(f"  Saved to {target_path} ({file_size} bytes)")
    
    assert os.path.exists(target_path), f"File missing: {target_path}"
    assert file_size > 50000, f"File too small ({file_size} <= 50000): {target_path}"
    with Image.open(target_path) as chk:
        assert chk.format == "PNG", f"Not PNG: {chk.format}"
        assert chk.size == target_size, f"Bad dimensions: {chk.size}"
    print(f"  [SUCCESS] Verified {target_rel_path}: PNG, {target_size}, {file_size} bytes")

def copy_existing_image(src_path, target_rel_path, target_size=None):
    target_path = os.path.join(BASE_DIR, "public", target_rel_path)
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    
    print(f"\n>>> Processing existing image {src_path} -> {target_rel_path}...")
    im = Image.open(src_path)
    if target_size and im.size != target_size:
        print(f"  Resizing from {im.size} to {target_size}...")
        im = im.resize(target_size, Image.Resampling.LANCZOS)
        
    if im.mode != "RGB":
        im = im.convert("RGB")
        
    im.save(target_path, format="PNG", optimize=True)
    file_size = os.path.getsize(target_path)
    print(f"  Saved to {target_path} ({file_size} bytes)")
    assert os.path.exists(target_path)
    assert file_size > 50000
    print(f"  [SUCCESS] Verified {target_rel_path}: PNG, {im.size}, {file_size} bytes")

def main():
    print("=== Generating Remaining Site Mockup Replacement Images ===")
    
    # 1. Copy already generated hero & material 1 images
    copy_existing_image(
        "/home/jack/.gemini/antigravity/brain/37c34283-6660-433e-b06d-fd333aa3a632/hero_tailored_silhouette_1790642598181.jpg",
        "images/hero/hero-tailored.png",
        (896, 1200)
    )
    copy_existing_image(
        "/home/jack/.gemini/antigravity/brain/37c34283-6660-433e-b06d-fd333aa3a632/hero_knitwear_silhouette_1790642616938.jpg",
        "images/hero/hero-knitwear.png",
        (896, 1200)
    )
    copy_existing_image(
        "/home/jack/.gemini/antigravity/brain/37c34283-6660-433e-b06d-fd333aa3a632/material_italian_virgin_wool_1790642634942.jpg",
        "images/materials/italian-virgin-wool.png",
        (1200, 900)
    )

    # 2. Generate remaining 3 materials and philosophy image
    TASKS = [
        {
            "rel_path": "images/materials/sandwashed-mulberry-silk.png",
            "size": (1200, 900),
            "prompt": (
                "Horizontal 4:3 aspect ratio luxury textile lookbook photography. "
                "Close-up tactile luxury textile photograph of 22 Momme sandwashed mulberry silk in Chalk Off-White and Pale Ivory. "
                "The heavy pure silk fabric is draped in cascading, fluid sculptural waves over a minimalist travertine pedestal. "
                "The fabric features an ultra-luxurious powdered peachskin suede handfeel, completely non-reflective and matte with subtle soft shadow depth. "
                "Extreme textile clarity showing the micro-fibers of Grade 6A peace silk. Diffused soft studio daylight. "
                "Shot on Hasselblad H6D-100c with HC Macro 120mm lens at f/8.0, tangibly soft cloth physics, zero cheap polyester sheen, zero synthetic glare."
                + UNIVERSAL_NEGATIVE
            )
        },
        {
            "rel_path": "images/materials/brushed-baby-mohair.png",
            "size": (1200, 900),
            "prompt": (
                "Horizontal 4:3 aspect ratio luxury textile lookbook photography. "
                "Extreme close-up macro textile photograph of 7-gauge ribbed knit brushed baby mohair and Peruvian baby alpaca yarn in Heather Oatmeal and Warm Stone. "
                "The shot captures the palpable cloud-like halo of natural teasel-brushed fibers illuminated by soft raking side daylight across the dimensional rib loops. "
                "Tangible softness, rich organic warmth, completely free of synthetic gloss or acrylic frizz. "
                "Shot on Hasselblad H6D-100c with HC Macro 120mm lens at f/8.0, surgical stitch clarity, quiet luxury aesthetic."
                + UNIVERSAL_NEGATIVE
            )
        },
        {
            "rel_path": "images/materials/french-full-grain-nappa.png",
            "size": (1200, 900),
            "prompt": (
                "Horizontal 4:3 aspect ratio luxury textile lookbook photography. "
                "Tactile macro photograph of supple French full-grain nappa lambskin leather in Pitch Obsidian black. "
                "The buttery leather hide is softly folded with gentle architectural curves over a raw concrete block, showing its subtle natural micro-grain texture "
                "and rich matte wax-satin patina without plastic gloss. Genuine vegetable-tanned depth, artisanal edge burnishing, soft diffuse daylight catching the gentle contours. "
                "Shot on Hasselblad H6D-100c with HC Macro 120mm lens at f/8.0, hyper-realistic leather materiality."
                + UNIVERSAL_NEGATIVE
            )
        },
        {
            "rel_path": "images/philosophy/design-studio.png",
            "size": (1920, 1080),
            "prompt": (
                "Horizontal 16:9 aspect ratio architectural interior photography. "
                "Wide cinematic view of the Blinc 2026 fashion design atelier and architecture studio. "
                "Sun-drenched minimalist brutalist interior featuring massive warm travertine walls, monolithic fluted concrete columns, and pale oak worktables. "
                "In the space are sculptural dressmaker mannequins draped in deconstructed wool tailoring, a large mood board with natural fabric swatches of worsted wool, "
                "raw silk, and brushed mohair, and floor-to-ceiling glass windows welcoming soft diffuse northern daylight. "
                "Serene, contemplative atmosphere of reduction and pure architectural craft. "
                "Shot on Hasselblad H6D-100c, HC 50mm f/3.5 lens at f/8.0, fine film grain, natural tones, zero artificial HDR, zero clutter."
                + UNIVERSAL_NEGATIVE
            )
        }
    ]

    for t in TASKS:
        process_image(t["rel_path"], t["prompt"], t["size"])

    print("\n=== All Site Mockup Replacement Images Successfully Generated & Saved! ===")

if __name__ == "__main__":
    main()

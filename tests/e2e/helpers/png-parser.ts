import fs from "node:fs";

export interface PngInfo {
  valid: boolean;
  width: number;
  height: number;
  aspectRatio: number;
  bitDepth: number;
  colorType: number;
  hasIend: boolean;
  error?: string;
}

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const IHDR_CHUNK_NAME = "IHDR";
const IEND_CHUNK_NAME = "IEND";

/**
 * Parses binary buffer to extract PNG metadata and validate structure.
 */
export function parsePngBuffer(buf: Buffer): PngInfo {
  if (buf.length < 8) {
    return {
      valid: false,
      width: 0,
      height: 0,
      aspectRatio: 0,
      bitDepth: 0,
      colorType: 0,
      hasIend: false,
      error: `File too small (${buf.length} bytes), minimum PNG header is 8 bytes`,
    };
  }

  // Check magic bytes
  if (!buf.subarray(0, 8).equals(PNG_MAGIC)) {
    return {
      valid: false,
      width: 0,
      height: 0,
      aspectRatio: 0,
      bitDepth: 0,
      colorType: 0,
      hasIend: false,
      error: `Invalid PNG magic signature: expected [89 50 4E 47 0D 0A 1A 0A], found [${buf
        .subarray(0, Math.min(8, buf.length))
        .toString("hex")
        .toUpperCase()}]`,
    };
  }

  if (buf.length < 33) {
    return {
      valid: false,
      width: 0,
      height: 0,
      aspectRatio: 0,
      bitDepth: 0,
      colorType: 0,
      hasIend: false,
      error: `File truncated before end of IHDR chunk (${buf.length} bytes)`,
    };
  }

  // Parse IHDR
  const ihdrChunkType = buf.toString("ascii", 12, 16);
  if (ihdrChunkType !== IHDR_CHUNK_NAME) {
    return {
      valid: false,
      width: 0,
      height: 0,
      aspectRatio: 0,
      bitDepth: 0,
      colorType: 0,
      hasIend: false,
      error: `Expected first chunk to be IHDR, found "${ihdrChunkType}"`,
    };
  }

  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  const bitDepth = buf.readUInt8(24);
  const colorType = buf.readUInt8(25);

  if (width === 0 || height === 0) {
    return {
      valid: false,
      width,
      height,
      aspectRatio: 0,
      bitDepth,
      colorType,
      hasIend: false,
      error: `Zero dimensions detected: width=${width}, height=${height}`,
    };
  }

  const aspectRatio = width / height;

  // Check for IEND chunk in last 64 bytes
  const tail = buf.subarray(Math.max(0, buf.length - 64));
  const hasIend = tail.includes(Buffer.from(IEND_CHUNK_NAME, "ascii"));

  return {
    valid: true,
    width,
    height,
    aspectRatio,
    bitDepth,
    colorType,
    hasIend,
  };
}

/**
 * Synchronously reads and parses a PNG file from the filesystem.
 */
export function inspectPngFile(filePath: string): {
  exists: boolean;
  size: number;
  info: PngInfo;
} {
  if (!fs.existsSync(filePath)) {
    return {
      exists: false,
      size: 0,
      info: {
        valid: false,
        width: 0,
        height: 0,
        aspectRatio: 0,
        bitDepth: 0,
        colorType: 0,
        hasIend: false,
        error: `File does not exist: ${filePath}`,
      },
    };
  }

  const stats = fs.statSync(filePath);
  const buffer = fs.readFileSync(filePath);
  const info = parsePngBuffer(buffer);

  return {
    exists: true,
    size: stats.size,
    info,
  };
}

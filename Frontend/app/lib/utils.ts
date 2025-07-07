import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function bigIntToHex(value: bigint): `0x${string}` {
  return `0x${value.toString(16)}`;
}


export function felt252ToString(felt: bigint): string {
  // Convert bigint to hex
  let hex = felt.toString(16);
  if (hex.length % 2 !== 0) hex = "0" + hex; // pad for full bytes

  // Convert hex to byte array
  const bytes = new Uint8Array(
    hex.match(/.{1,2}/g)!.map((b) => parseInt(b, 16))
  );

  // Decode bytes to UTF-8 string
  const utf8String = new TextDecoder().decode(bytes).replace(/\0/g, "");

  // Validate: printable characters and not just a single suspicious byte
  const isPrintable = /^[\x20-\x7E]+$/.test(utf8String); // printable ASCII
  const isSuspiciouslyShort = utf8String.length === 1 && felt < 256n;

  if (!isPrintable || isSuspiciouslyShort) {
    return felt.toString(); // fallback: return number as string
  }

  return utf8String;
}


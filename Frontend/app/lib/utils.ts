import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function bigIntToHex(value: bigint): `0x${string}` {
  return `0x${value.toString(16)}`;
}

export function felt252ToString(felt: bigint): string {
  let hex = felt.toString(16);
  if (hex.length % 2 !== 0) hex = "0" + hex;

  const buffer = Buffer.from(hex, "hex");
  const utf8String = buffer.toString("utf-8").replace(/\0/g, "");

  // If the decoded string is non-printable or suspiciously 1 char, return the number as a string
  const isMostlyPrintable = /^[\x20-\x7E]+$/.test(utf8String); // printable ASCII
  const isTooShortAndSuspicious = utf8String.length === 1 && felt < 256n;

  if (!isMostlyPrintable || isTooShortAndSuspicious) {
    return felt.toString(); // fallback: treat as plain number
  }

  return utf8String;
}

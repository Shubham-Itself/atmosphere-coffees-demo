/** Validation for the taster form. Each validator returns an error message, or "" when the value is fine. */

export function validateName(v: string) {
  const s = v.trim();
  if (!s) return "Please enter your name.";
  if (s.length < 2) return "Your name looks too short.";
  if (s.length > 60) return "Please keep your name under 60 characters.";
  if (!/^[\p{L}][\p{L}\p{M} .'-]*$/u.test(s)) return "Please use letters only (spaces, hyphens and apostrophes are fine).";
  return "";
}

export function validateEmail(v: string) {
  const s = v.trim();
  if (!s) return "Please enter your email address.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s) || s.includes("..")) return "Enter a valid email, like name@example.com.";
  return "";
}

/**
 * Normalises a phone number to E.164-style digits, or null if it isn't valid.
 * Indian numbers (the default) may be written as 98765 43210, 098765 43210, 91 98765 43210 or +91 98765 43210;
 * other countries need a leading + and country code.
 */
export function normalizePhone(v: string): string | null {
  const s = v.trim();
  if (/[^0-9+()\-\s.]/.test(s) || s.lastIndexOf("+") > 0) return null;
  const digits = s.replace(/\D/g, "");
  const indian = (d: string) => (/^[6-9]\d{9}$/.test(d) ? `+91${d}` : null);
  if (s.startsWith("+")) {
    if (digits.startsWith("91")) return indian(digits.slice(2));
    return /^[1-9]\d{7,14}$/.test(digits) ? `+${digits}` : null;
  }
  if (digits.length === 10) return indian(digits);
  if (digits.length === 11 && digits.startsWith("0")) return indian(digits.slice(1));
  if (digits.length === 12 && digits.startsWith("91")) return indian(digits.slice(2));
  return null;
}

export function validatePhone(v: string) {
  const s = v.trim();
  if (!s) return "Please enter your phone number.";
  if (/[^0-9+()\-\s.]/.test(s)) return "Phone numbers can only contain digits, spaces, + and -.";
  if (normalizePhone(s)) return "";
  const digits = s.replace(/\D/g, "");
  if (s.startsWith("+") && !digits.startsWith("91")) return "Enter a valid international number, e.g. +44 7911 123456.";
  if (digits.length < 10) return "That number is too short. Enter a 10-digit mobile number.";
  return "Enter a valid 10-digit mobile number starting with 6, 7, 8 or 9.";
}

/** "+919876543210" → "+91 98765 43210"; other numbers are returned as-is. */
export function formatPhone(e164: string) {
  return e164.startsWith("+91") && e164.length === 13 ? `+91 ${e164.slice(3, 8)} ${e164.slice(8)}` : e164;
}

let disposableDomains = new Set();

async function loadDisposableDomains() {
  try {
    const data = await import("disposable-email-domains", {
      with: { type: "json" },
    });
    disposableDomains = new Set(data.default);
  } catch (err) {
    console.error("Failed to load disposable domains:", err);
    disposableDomains = new Set();
  }
}

loadDisposableDomains();

const SUSPICIOUS_PATTERNS = [
  /^[a-z0-9]{15,}$/i,
  /^\d{8,}$/,
  /^[a-z]+[0-9]{5,}[a-z0-9]*$/i,
  /^test[a-z0-9]*$/i,
  /^fake[a-z0-9]*$/i,
  /^temp[a-z0-9]*$/i,
];

export async function validateEmail(email) {
  if (!email || typeof email !== "string") {
    return { valid: false, reason: "Email không hợp lệ" };
  }

  const parts = email.split("@");
  if (parts.length !== 2) {
    return { valid: false, reason: "Email không hợp lệ" };
  }

  const [, domain] = parts;
  const domainLower = domain.toLowerCase();

  if (!domainLower.includes(".")) {
    return { valid: false, reason: "Email không hợp lệ" };
  }

  if (domainLower.startsWith(".")) {
    return { valid: false, reason: "Email không hợp lệ" };
  }

  if (disposableDomains.has(domainLower)) {
    return { valid: false, reason: "Email tạm không được phép" };
  }

  const localPart = parts[0];
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(localPart)) {
      return { valid: false, reason: "Email không hợp lệ" };
    }
  }

  const domainParts = domainLower.split(".");
  if (domainParts.length > 4) {
    return { valid: false, reason: "Email không hợp lệ" };
  }

  return { valid: true };
}

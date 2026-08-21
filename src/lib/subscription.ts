const SUBSCRIBER_EMAIL_KEY = "ocil-subscriber-email";

export function getSubscriberEmail(): string | null {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem(SUBSCRIBER_EMAIL_KEY);
  } catch {
    return null;
  }
}

export function setSubscriberEmail(email: string): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(SUBSCRIBER_EMAIL_KEY, email.toLowerCase().trim());
  } catch {
    // ignore
  }
}

export function clearSubscriberEmail(): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(SUBSCRIBER_EMAIL_KEY);
  } catch {
    // ignore
  }
}

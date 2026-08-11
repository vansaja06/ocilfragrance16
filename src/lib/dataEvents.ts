type Listener = () => void;

const listeners = new Set<Listener>();

const CHANNEL_NAME = "ocil-admin-data-changed";

let channel: BroadcastChannel | null = null;

function getChannel(): BroadcastChannel | null {
  if (
    typeof window === "undefined" ||
    typeof BroadcastChannel === "undefined"
  ) {
    return null;
  }

  if (!channel) {
    channel = new BroadcastChannel(CHANNEL_NAME);

    channel.onmessage = () => {
      listeners.forEach((listener) => listener());
    };
  }

  return channel;
}

export function notifyDataChanged() {
  const ch = getChannel();

  if (ch) {
    ch.postMessage("refresh");
  } else {
    listeners.forEach((listener) => listener());
  }
}

export function onDataChanged(listener: Listener): () => void {
  listeners.add(listener);

  getChannel();

  return () => {
    listeners.delete(listener);
  };
}

export function notifyCartChanged() {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new CustomEvent("ocil-fragrance-cart"));
}

export function onCartChanged(listener: Listener): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = () => listener();

  window.addEventListener("ocil-fragrance-cart", handler);

  return () => {
    window.removeEventListener("ocil-fragrance-cart", handler);
  };
}

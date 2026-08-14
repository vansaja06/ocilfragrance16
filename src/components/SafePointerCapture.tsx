"use client";

export default function SafePointerCapture() {
  return null;
}

if (typeof Element !== "undefined") {
  const original = Element.prototype.releasePointerCapture;

  Element.prototype.releasePointerCapture = function (
    pointerId: number,
  ): void {
    try {
      original.call(this, pointerId);
    } catch (error) {
      if (error instanceof DOMException && error.name === "NotFoundError") {
        return;
      }
      throw error;
    }
  };
}

export default function BackgroundGlow() {
  return (
    <>
      {/* Top Left Glow */}
      <div
        className="
          absolute
          -top-32
          -left-32
          h-[420px]
          w-[420px]
          rounded-full
          bg-white
          opacity-90
          blur-[170px]
        "
      />

      {/* Bottom Right Glow */}
      <div
        className="
          absolute
          -bottom-44
          -right-40
          h-[520px]
          w-[520px]
          rounded-full
          bg-slate-200/70
          blur-[180px]
        "
      />

      {/* Center Glow */}
      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-[700px]
          w-[700px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-white/30
          blur-[220px]
        "
      />

      {/* Radial Highlight */}
      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.55),transparent_70%)]
        "
      />

      {/* Grid Pattern */}
      <div
        className="
          absolute
          inset-0
          opacity-[0.08]
          [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
          [background-size:70px_70px]
        "
      />

      {/* Noise Texture */}
      <div
        className="
          absolute
          inset-0
          opacity-[0.03]
          mix-blend-overlay
          [background-image:radial-gradient(#000_0.5px,transparent_0.5px)]
          [background-size:8px_8px]
        "
      />
    </>
  );
}
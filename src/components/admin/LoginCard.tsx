import LoginForm from "./LoginForm";

export default function LoginCard() {
  return (
    <div className="relative overflow-hidden rounded-[36px] border border-white/40 bg-white/15 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.08)] backdrop-blur-3xl md:p-10">

      {/* Reflection */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-white/50 blur-3xl" />

      <div className="pointer-events-none absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-white/20 blur-3xl" />

      {/* Glass Highlight */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent" />

      {/* Content */}
      <div className="relative z-10">

        {/* Brand */}
        <div className="mb-8 flex justify-center">

          <div className="rounded-full border border-white/40 bg-white/20 px-5 py-2 backdrop-blur-2xl">

            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-neutral-700">
              OcilFragrance 16
            </span>

          </div>

        </div>

        {/* Title */}
        <div className="text-center">

          <h1 className="text-4xl font-bold tracking-tight text-neutral-900">
            Administrator
          </h1>

          <p className="mt-3 text-sm leading-6 text-neutral-600">
            Sign in to manage products, orders,
            customers and your online store.
          </p>

        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

        {/* Login Form */}
        <LoginForm />

        {/* Footer */}
        <div className="mt-8 text-center">

          <p className="text-xs text-neutral-500">
            © 2026 OcilFragrance 16.
            <br />
            Administrator Panel
          </p>

        </div>

      </div>

    </div>
  );
}
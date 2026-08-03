import BackgroundGlow from "@/components/admin/BackgroundGlow";
import LoginCard from "@/components/admin/LoginCard";

export default function AdminLoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8f8f6] px-6">
      <BackgroundGlow />

      <div className="relative z-10 w-full max-w-md">
        <LoginCard />
      </div>
    </main>
  );
}
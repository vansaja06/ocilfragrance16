"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/api";

export default function LoginForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post("/api/admin/login", {
        email,
        password,
      });

      toast.success(res.data.message);

      router.push("/admin/dashboard");
    } catch (error) {
      toast.error(getErrorMessage(error, "Login gagal"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="space-y-6"
    >
      {/* EMAIL */}

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Email
        </label>

        <div className="relative">

          <Mail
            size={18}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-500"
          />

          <Input
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            type="email"
            placeholder="admin@ocilfragrance16.com"
            className="h-14 rounded-full pl-12"
          />

        </div>
      </div>

      {/* PASSWORD */}

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Password
        </label>

        <div className="relative">

          <Lock
            size={18}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-500"
          />

          <Input
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            placeholder="********"
            className="h-14 rounded-full pl-12 pr-12"
          />

          <button
            type="button"
            className="absolute right-5 top-1/2 -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            {showPassword ? (
              <EyeOff size={18}/>
            ) : (
              <Eye size={18}/>
            )}
          </button>

        </div>
      </div>

      {/* REMEMBER */}

      <div className="flex justify-between text-sm">

        <label className="flex gap-2 items-center">

          <input type="checkbox"/>

          Remember Me

        </label>

        <button type="button">
          Forgot Password?
        </button>

      </div>

      {/* LOGIN */}

      <Button
        disabled={loading}
        className="w-full h-14 rounded-full"
      >
        {loading ? "Loading..." : "Login"}
      </Button>

    </form>
  );
}
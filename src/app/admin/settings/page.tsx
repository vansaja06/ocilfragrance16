"use client";

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

import { Settings as SettingsIcon } from "lucide-react";

import DashboardLayout from "@/components/admin/DashboardLayout";
import PageHeader from "@/components/admin/PageHeader";
import LoadingBlock from "@/components/admin/LoadingBlock";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { api, getErrorMessage } from "@/lib/api";
import { useFetch } from "@/lib/useFetch";
import { Settings } from "@/lib/types";

interface SettingsResponse {
  settings: Settings;
}

const emptySettings: Settings = {
  storeName: "",
  tagline: "",
  email: "",
  phone: "",
  address: "",
  instagram: "",
  twitter: "",
  facebook: "",
};

export default function SettingsPage() {
  const { data, loading, refetch } = useFetch<SettingsResponse>("/settings");

  const [form, setForm] = useState<Settings>(emptySettings);

  const [syncedData, setSyncedData] = useState<Settings | null>(null);

  const [saving, setSaving] = useState(false);

  if (data?.settings && data.settings !== syncedData) {
    setSyncedData(data.settings);

    setForm({ ...emptySettings, ...data.settings });
  }

  const update = (key: keyof Settings, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      await api.put("/settings", form);

      toast.success("Pengaturan berhasil disimpan");

      refetch();
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menyimpan"));
    } finally {
      setSaving(false);
    }
  };

  const fields: {
    key: keyof Settings;
    label: string;
    placeholder: string;
  }[] = [
    { key: "storeName", label: "Nama Toko", placeholder: "Ocil Fragrance" },
    { key: "tagline", label: "Tagline", placeholder: "The Essence of Elegance" },
    { key: "email", label: "Email", placeholder: "hello@ocilfragrance16.com" },
    { key: "phone", label: "Telepon", placeholder: "+62 812 3456 7890" },
    { key: "address", label: "Alamat", placeholder: "Jl. Contoh No. 1" },
    { key: "instagram", label: "Instagram", placeholder: "@ocilfragrance" },
    { key: "twitter", label: "Twitter", placeholder: "@ocilfragrance" },
    { key: "facebook", label: "Facebook", placeholder: "Ocil Fragrance" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHeader
          label="Ocil Fragrance"
          title="Pengaturan"
          subtitle="Kelola informasi toko Anda."
        />

        {loading ? (
          <LoadingBlock rows={4} />
        ) : (
          <form
            onSubmit={handleSubmit}
            className="max-w-2xl space-y-6"
          >
            <section className="rounded-3xl border border-neutral-200 bg-white p-6 lg:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f8f8f8] text-neutral-700">
                  <SettingsIcon size={20} />
                </div>

                <div>
                  <h2 className="text-xl font-light tracking-tight text-black">
                    Informasi Toko
                  </h2>

                  <p className="text-sm text-neutral-500">
                    Data yang dipakai di halaman utama.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="text-sm font-medium">
                      {field.label}
                    </label>

                    <Input
                      value={form[field.key] ?? ""}
                      onChange={(e) => update(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="h-12 rounded-2xl px-4"
                    />
                  </div>
                ))}
              </div>
            </section>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="h-12 rounded-full bg-black px-8 text-white hover:bg-neutral-800"
              >
                {saving ? "Menyimpan…" : "Simpan Pengaturan"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { api } from "@/lib/api";
import { Product, Settings } from "@/lib/types";

interface SettingsResponse {
  settings?: Settings;
}

interface ProductsResponse {
  products?: Product[];
}

interface HomeDataContextValue {
  settings?: Settings;
  products?: Product[];
  loading: boolean;
}

const HomeDataContext = createContext<HomeDataContextValue | undefined>(
  undefined
);

export function HomeDataProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings | undefined>(undefined);
  const [products, setProducts] = useState<Product[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      api.get<SettingsResponse>("/settings"),
      api.get<ProductsResponse>("/products"),
    ])
      .then(([settingsRes, productsRes]) => {
        if (cancelled) return;

        setSettings(settingsRes.data?.settings ?? {});
        setProducts(productsRes.data?.products ?? []);
      })
      .catch(() => {
        if (!cancelled) {
          setSettings({});
          setProducts([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <HomeDataContext.Provider value={{ settings, products, loading }}>
      {children}
    </HomeDataContext.Provider>
  );
}

export function useHomeData() {
  const ctx = useContext(HomeDataContext);

  if (!ctx) {
    throw new Error("useHomeData must be used within HomeDataProvider");
  }

  return ctx;
}

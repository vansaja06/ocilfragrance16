"use client";

import { useCallback, useEffect, useState } from "react";

import { api, getErrorMessage } from "./api";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T = Record<string, unknown>>(
  url: string | null
): FetchState<T> & { refetch: (opts?: { silent?: boolean }) => void } {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: Boolean(url),
    error: null,
  });

  const [attempt, setAttempt] = useState(0);

  const refetch = useCallback(
    (opts?: { silent?: boolean }) => {
      if (!url) return;

      setState((prev) => ({
        ...prev,
        loading: opts?.silent ? prev.loading : true,
        error: null,
      }));

      setAttempt((prev) => prev + 1);
    },
    [url]
  );

  useEffect(() => {
    if (!url) return;

    let cancelled = false;

    api
      .get<T>(url)
      .then((res) => {
        if (!cancelled) {
          setState({ data: res.data, loading: false, error: null });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: getErrorMessage(error),
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [url, attempt]);

  return { ...state, refetch };
}

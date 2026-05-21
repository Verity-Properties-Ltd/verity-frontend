'use client';

import { useCallback, useEffect, useState } from 'react';
import { EMPTY_DRAFT, type RequestDraft } from '@/lib/types/request';

const KEY = 'verity:draft';

function readDraft(): RequestDraft {
  if (typeof window === 'undefined') return structuredClone(EMPTY_DRAFT);
  const raw = window.sessionStorage.getItem(KEY);
  if (!raw) return structuredClone(EMPTY_DRAFT);
  try {
    return { ...structuredClone(EMPTY_DRAFT), ...JSON.parse(raw) };
  } catch {
    return structuredClone(EMPTY_DRAFT);
  }
}

function writeDraft(draft: RequestDraft) {
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(KEY, JSON.stringify(draft));
  }
}

export function useRequestDraft() {
  const [draft, setDraft] = useState<RequestDraft>(() => structuredClone(EMPTY_DRAFT));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setDraft(readDraft());
    setHydrated(true);
  }, []);

  const update = useCallback((patch: Partial<RequestDraft> | ((prev: RequestDraft) => RequestDraft)) => {
    setDraft((prev) => {
      const next = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch };
      writeDraft(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    const fresh = structuredClone(EMPTY_DRAFT);
    setDraft(fresh);
    if (typeof window !== 'undefined') window.sessionStorage.removeItem(KEY);
  }, []);

  return { draft, update, clear, hydrated };
}

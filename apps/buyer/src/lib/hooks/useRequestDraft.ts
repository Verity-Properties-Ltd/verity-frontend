'use client';

import { useCallback, useEffect, useState } from 'react';
import { EMPTY_DRAFT, EMPTY_PROPERTY, type RequestDraft } from '@/lib/types/request';

// v2 — bumped when RequestProperty was restructured for RESO adoption.
// Old `verity:draft` entries (pre-RESO shape) are simply ignored on load.
const KEY = 'verity:draft-v2';

function readDraft(): RequestDraft {
  if (typeof window === 'undefined') return structuredClone(EMPTY_DRAFT);
  const raw = window.sessionStorage.getItem(KEY);
  if (!raw) return structuredClone(EMPTY_DRAFT);
  try {
    const parsed = JSON.parse(raw) as Partial<RequestDraft>;
    // Deep-merge the `property` key so any missing RESO fields are backfilled
    // from EMPTY_PROPERTY instead of leaving the wizard in a half-initialized state.
    return {
      ...structuredClone(EMPTY_DRAFT),
      ...parsed,
      property: { ...EMPTY_PROPERTY, ...(parsed.property ?? {}) },
    };
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

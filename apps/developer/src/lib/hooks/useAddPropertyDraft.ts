'use client';

import { useCallback, useEffect, useState } from 'react';
import { EMPTY_ADD_DRAFT, type AddPropertyDraft } from '@/lib/types/add';

const KEY = 'verity:dev-add-draft';

function readDraft(): AddPropertyDraft {
  if (typeof window === 'undefined') return structuredClone(EMPTY_ADD_DRAFT);
  const raw = window.sessionStorage.getItem(KEY);
  if (!raw) return structuredClone(EMPTY_ADD_DRAFT);
  try {
    return { ...structuredClone(EMPTY_ADD_DRAFT), ...JSON.parse(raw) };
  } catch {
    return structuredClone(EMPTY_ADD_DRAFT);
  }
}

function writeDraft(draft: AddPropertyDraft) {
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(KEY, JSON.stringify(draft));
  }
}

export function useAddPropertyDraft() {
  const [draft, setDraft] = useState<AddPropertyDraft>(() => structuredClone(EMPTY_ADD_DRAFT));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setDraft(readDraft());
    setHydrated(true);
  }, []);

  const update = useCallback((patch: Partial<AddPropertyDraft> | ((prev: AddPropertyDraft) => AddPropertyDraft)) => {
    setDraft((prev) => {
      const next = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch };
      writeDraft(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    const fresh = structuredClone(EMPTY_ADD_DRAFT);
    setDraft(fresh);
    if (typeof window !== 'undefined') window.sessionStorage.removeItem(KEY);
  }, []);

  return { draft, update, clear, hydrated };
}

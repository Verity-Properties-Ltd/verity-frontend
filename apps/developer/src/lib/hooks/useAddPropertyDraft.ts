'use client';

import { useCallback, useEffect, useState } from 'react';
import { EMPTY_ADD_DRAFT, type AddPropertyDraft } from '@/lib/types/add';

const KEY = 'verity:dev-add-draft';
const DRAFTS_KEY = 'verity:dev-drafts';

export type DraftRecord = {
  vpid: string;          // 'DRAFT-<base36 timestamp>'
  draft: AddPropertyDraft;
  createdAt: string;     // ISO timestamp
};

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

export function readDraftRecords(): Record<string, DraftRecord> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(DRAFTS_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeDraftRecords(records: Record<string, DraftRecord>) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(DRAFTS_KEY, JSON.stringify(records));
}

export function commitDraft(draft: AddPropertyDraft, existingVpid?: string): { vpid: string } {
  // If we're resuming an existing draft, overwrite that record in place so the
  // portfolio row updates rather than spawning a duplicate.
  const vpid = existingVpid && existingVpid.startsWith('DRAFT-')
    ? existingVpid
    : `DRAFT-${Date.now().toString(36).toUpperCase()}`;
  const records = readDraftRecords();
  records[vpid] = { vpid, draft, createdAt: records[vpid]?.createdAt ?? new Date().toISOString() };
  writeDraftRecords(records);
  return { vpid };
}

export function loadDraft(vpid: string): AddPropertyDraft | null {
  const records = readDraftRecords();
  return records[vpid]?.draft ?? null;
}

export function removeDraft(vpid: string): void {
  const records = readDraftRecords();
  if (records[vpid]) {
    delete records[vpid];
    writeDraftRecords(records);
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

  /**
   * Replace the working copy in sessionStorage with the contents of a saved
   * draft record. Used by the resume flow (?draft=DRAFT-XYZ).
   */
  const hydrateFromRecord = useCallback((next: AddPropertyDraft) => {
    const merged = { ...structuredClone(EMPTY_ADD_DRAFT), ...next };
    setDraft(merged);
    writeDraft(merged);
  }, []);

  return { draft, update, clear, hydrateFromRecord, hydrated };
}

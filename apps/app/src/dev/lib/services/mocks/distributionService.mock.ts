export const distributionService = {
  async getDefaultScope(): Promise<{ verifiedCount: number; sampleVpid: string; sampleAddress: string }> {
    await new Promise((r) => setTimeout(r, 100));
    return {
      verifiedCount: 81,
      sampleVpid: 'VRT-LA-2025-0184',
      sampleAddress: 'Lekki Block A · Plot 12',
    };
  },

  async copyUrl(vpid: string): Promise<{ url: string }> {
    const url = `https://verity.properties/v/${vpid.toUpperCase()}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try { await navigator.clipboard.writeText(url); } catch { /* ignore */ }
    }
    return { url };
  },

  embedSnippet(vpid: string): string {
    return `<script src="https://cdn.verity.properties/embed.js" data-vpid="${vpid.toUpperCase()}" async></script>`;
  },

  async copyEmbed(vpid: string): Promise<{ snippet: string }> {
    const snippet = this.embedSnippet(vpid);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try { await navigator.clipboard.writeText(snippet); } catch { /* ignore */ }
    }
    return { snippet };
  },
};

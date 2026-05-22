export type DistributionScope =
  | { kind: 'all-verified'; count: number }
  | { kind: 'selected'; count: number }
  | { kind: 'single'; vpid: string; address: string };

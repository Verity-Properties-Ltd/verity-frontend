/** Decorative QR placeholder — same look as the gallery, not a real QR. */
export function QrPlaceholder() {
  const cells = [
    [8,1],[10,1],[12,1],[8,3],[11,3],[13,3],[9,4],[12,4],[8,6],[10,6],
    [1,8],[3,8],[5,8],[7,8],[8,8],[10,8],[12,8],[14,8],[16,8],[18,8],
    [2,9],[4,9],[8,9],[11,9],[13,9],[15,9],[17,9],[19,9],
    [1,10],[3,10],[6,10],[8,10],[10,10],[12,10],[14,10],[16,10],[18,10],[20,10],
    [2,11],[5,11],[7,11],[9,11],[11,11],[13,11],[15,11],[17,11],[19,11],
    [1,12],[3,12],[6,12],[8,12],[12,12],[16,12],[18,12],
    [9,13],[11,13],[13,13],[15,13],[17,13],[19,13],
    [8,14],[10,15],[12,15],[14,15],[16,15],[18,15],[20,15],
    [9,16],[11,17],[13,17],[15,17],[17,17],[19,17],
    [8,18],[10,19],[12,19],[14,19],[16,19],[18,19],[20,19],
    [9,20],[11,20],[13,20],[15,20],[17,20],[19,20],
  ];
  return (
    <svg width="100" height="100" viewBox="0 0 21 21" fill="none" aria-hidden>
      <rect width="21" height="21" fill="#fff" />
      <rect x="0" y="0" width="7" height="7" fill="#1E2260" />
      <rect x="1" y="1" width="5" height="5" fill="#fff" />
      <rect x="2" y="2" width="3" height="3" fill="#1E2260" />
      <rect x="14" y="0" width="7" height="7" fill="#1E2260" />
      <rect x="15" y="1" width="5" height="5" fill="#fff" />
      <rect x="16" y="2" width="3" height="3" fill="#1E2260" />
      <rect x="0" y="14" width="7" height="7" fill="#1E2260" />
      <rect x="1" y="15" width="5" height="5" fill="#fff" />
      <rect x="2" y="16" width="3" height="3" fill="#1E2260" />
      {cells.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="1" height="1" fill="#1E2260" />
      ))}
      <rect x="9" y="9" width="3" height="3" fill="#C9A961" stroke="#fff" strokeWidth="0.4" />
    </svg>
  );
}

// Pot terakota. Ada tanah dan highlight bibir pot. Tanpa aset gambar (PRD 73).
export default function FlowerPot() {
  return (
    <svg viewBox="0 0 120 92" className="h-auto w-full" aria-hidden="true">
      <ellipse cx="60" cy="84" rx="42" ry="6" fill="rgba(0,0,0,0.35)" />
      <path d="M28 32 h64 l-8 46 a6 6 0 0 1 -6 5 h-36 a6 6 0 0 1 -6 -5 z" fill="#B0714F" />
      <path d="M28 32 h64 l-1.5 9 h-61 z" fill="#8f5636" opacity="0.55" />
      <path d="M36 40 h10 l-4 34 h-9 z" fill="#ffffff" opacity="0.08" />
      <path d="M28 32 h64 l-2 12 h-60 z" fill="#C98A63" />
      <rect x="20" y="22" width="80" height="14" rx="5" fill="#A2603F" />
      <rect x="20" y="22" width="80" height="4" rx="2" fill="#ffffff" opacity="0.14" />
      <ellipse cx="60" cy="22" rx="34" ry="5" fill="#4a352a" />
      <ellipse cx="60" cy="21" rx="28" ry="3.5" fill="#5d4433" />
    </svg>
  )
}

// export const rarityLabelMap: Record<string, string> = {
//   COMMON: 'Phổ biến',
//   RARE: 'Cao cấp',
//   EPIC: 'Hiếm',
//   SECRET: 'Cực hiếm'
// };

export const rarityLabelMap: Record<string, { label: string; color: string }> = {
  COMMON: { label: 'Phổ biến', color: '#9CA3AF' },
  RARE: { label: 'Cao cấp', color: '#10B981' },
  EPIC: { label: 'Hiếm', color: '#3B82F6' },
  SECRET: { label: 'Cực hiếm', color: '#F59E0B' },
};

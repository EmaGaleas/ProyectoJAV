export const fmtLps = (n: number) =>
  `L. ${n.toLocaleString('es-HN', { minimumFractionDigits: 2 })}`;

export const fmtDate = (iso: string) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  return `${d} ${meses[parseInt(m) - 1]} ${y}`;
};
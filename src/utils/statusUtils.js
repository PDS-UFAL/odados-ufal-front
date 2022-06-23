export const chipStatusColor = (status) => {
  return (
    {
      open: 'yellow',
      closed: 'red',
      not_started: '#80808087',
      sectorHasAnswered: 'green',
    }[status] || 'primary'
  );
};
export const translatedStatus = (status) => {
  return {
    open: 'Aberto',
    closed: 'Fechado',
    not_started: 'Não iniciado',
    sectorHasAnswered: 'Respondido',
  }[status];
};

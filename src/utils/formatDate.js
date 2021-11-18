export const formatDate = (value) => {
  if (!value) return null;
  return new Date(value).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};

export const parseISODate = (date) => {
  if (!date) {
    return null;
  }
  const [day, month, year] = date.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

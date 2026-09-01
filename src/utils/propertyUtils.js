export const furnishedTypes = [
  "Appartement meublé",
  "Villa meublée",
  "Chambre meublée"
];

export const isFurnished = (type) => {
  return furnishedTypes.includes(type);
};
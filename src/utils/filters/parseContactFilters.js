
const parseBoolean = (value) => {
  if (typeof value !== 'string') return;

  if (value === 'true') return true;
  if (value === 'false') return false;

  return;
};

const parseContactType = (value) => {
  const allowedTypes = ['work', 'home', 'personal'];
  if (typeof value !== 'string') return;
  if (allowedTypes.includes(value)) return value;
  return;
};

export const parseContactFilters = ({ isFavourite, contactType }) => {
  const parsedFavourite = parseBoolean(isFavourite);
  const parsedContactType = parseContactType(contactType);

  return {
    isFavourite: parsedFavourite,
    contactType: parsedContactType,
  };
};


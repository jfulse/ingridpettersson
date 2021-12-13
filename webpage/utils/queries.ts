export const pieceProjection = `
  _id,
  title,
  "category": category -> title,
  "firstImage": images {
    _key,
    _type,
    asset ->
  }[0]
`;

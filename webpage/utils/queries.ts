export const pieceProjection = `
  _id,
  title,
  "firstImage": images {
    _key,
    _type,
    asset ->
  }[0],
  "secondImage": images {
    _key,
    _type,
    asset ->
  }[1]
`;

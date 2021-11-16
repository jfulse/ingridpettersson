export const pieceProjection = `
  _id,
  title,
  "firstImage": images {
    _key,
    asset ->
  }[0],
  "secondImage": images {
    _key,
    asset ->
  }[1]
`;

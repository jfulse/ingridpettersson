export default (text: string): string =>
  `${text.slice(0, 1).toUpperCase()}${text.slice(1).toLowerCase()}`;

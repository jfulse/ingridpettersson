type TypeOrFalsy<T> = T | undefined | null | false | "";

const isTruthy = <T>(item: TypeOrFalsy<T>): item is T => Boolean(item);

const filterTruthy = <T = unknown>(list: TypeOrFalsy<T>[]): T[] =>
  list.filter(isTruthy);

export default filterTruthy;

export default <Key extends string, Value extends unknown>(obj: Record<Key, Value>, value: Value): Key | undefined =>
  Object.keys(obj).find((key) => obj[key as Key] === value) as Key | undefined;

type StringCounts = { [key: string]: number };

const countRepetitions = (items: string[] = []): StringCounts => {
  return items.reduce(
    (result: StringCounts, item: string) => ({
      ...result,
      [item]: Object.keys(result).includes(item) ? result[item] + 1 : 1,
    }),
    {}
  );
};

export default countRepetitions;

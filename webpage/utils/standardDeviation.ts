import { compose, map, mean, sum } from "lodash/fp";

const avgSquare = (avg: number) => (value: number) => (avg - value) ** 2;

const squareSum = (avg: number) => compose(sum, map(avgSquare(avg)));

export default (list: number[]): number => Math.sqrt(squareSum(mean(list))(list));

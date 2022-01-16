import { EMPTY_COLOR } from "../constants";
import { Color } from "../types";

export default ({ rgba: [R, G, B, A] }: Color = EMPTY_COLOR): string => `rgba(${R}, ${G}, ${B}, ${A})`;

import { compose } from "lodash/fp";

const camelToSpaces = (text = "") => text.replace(/([A-Z\d])/g, " $1").toLowerCase();

const capitalize = (text = "") => `${text.slice(0, 1).toUpperCase()}${text.slice(1)}`;

const camelToName = compose(capitalize, camelToSpaces);

export default camelToName;

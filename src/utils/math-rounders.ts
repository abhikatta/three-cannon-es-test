export const getAbsNum = (type: "round" | "floor" | "ceil", range?: number) =>
  Math[type](Math.random() * (range ?? 1));

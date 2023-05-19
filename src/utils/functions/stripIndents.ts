/**
 * Strip indentation from a multi-line string.
 * @param input The input to strip indentation from.
 * @returns The stripped indentation.
 */
const stripIndents = (input: string) => {
  // Find the minimum number of leading spaces in non-empty lines
  const minIndent = input
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .reduce((min, line) => {
      const match = line.match(/^\s*/);
      return match ? Math.min(min, match[0].length) : min;
    }, Infinity);

  // Remove the minimum indent from each line
  const output = input
    .split('\n')
    .map((line) => line.slice(minIndent))
    .join('\n');

  return output;
};

export default stripIndents;

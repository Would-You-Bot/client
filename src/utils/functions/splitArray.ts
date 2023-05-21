// Splits an array into chunks
/**
 * @param array
 * @param max
 */
const splitArray = (array: any[], max: number): any[][] => {
  const result = array.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / max);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);

  return result;
};

export default splitArray;

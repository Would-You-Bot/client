const array = ["hello", "bye"]

console.log(array);

const newArray = JSON.stringify(array)

console.log(newArray);

const newNewArray = JSON.parse(newArray)

console.log(newNewArray);

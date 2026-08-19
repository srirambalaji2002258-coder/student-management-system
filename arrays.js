let fruits = ["Apple", "Banana", "Mango"];

console.log("Original array:", fruits);

// Access elements
console.log("First fruit:", fruits[0]);
console.log("Second fruit:", fruits[1]);

// Find number of elements
console.log("Number of fruits:", fruits.length);

// Add fruit at the end
fruits.push("Orange");
console.log("After push:", fruits);

// Remove fruit from the end
fruits.pop();
console.log("After pop:", fruits);

// Add fruit at the beginning
fruits.unshift("Grapes");
console.log("After unshift:", fruits);

// Remove fruit from the beginning
fruits.shift();
console.log("After shift:", fruits);

// Change an element
fruits[1] = "Pineapple";
console.log("After changing:", fruits);

// Check whether a fruit exists
console.log("Is Mango available?", fruits.includes("Mango"));
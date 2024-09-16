# Sudoku Solver and Validator

A Deno-based Sudoku solver and validator library designed to make solving and validating Sudoku puzzles easy and efficient.

## Features

- **Sudoku Validation**: Ensure the Sudoku puzzle is valid.
- **Sudoku Solving**: Solve the given Sudoku puzzle.
- **Sudoku Generation**: Generate random solvable Sudoku puzzles.
- **Sudoku Encoding/Decoding**: Encode and decode Sudoku puzzles to and from base64.
- **Multiple Solutions Count**: Compute the number of possible solutions for a given Sudoku puzzle.

## Installation

Ensure you have Deno installed on your machine. For installation, follow the [official Deno installation guide](https://deno.land/#installation).

## Usage

### Importing the Module

Include the necessary imports from the standard library:

```json
{
  "imports": {
    "@std/assert": "jsr:@std/assert@^1.0.5",
    "@std/encoding": "jsr:@std/encoding@^1.0.5",
    "@std/fmt": "jsr:@std/fmt@^1.0.2"
  }
}
```

### Example

Here's a quick example of how to use this library:

```ts
import { Sudoku } from "./src/sudoku.ts";

// @deno-fmt-ignore
const sudoku = new Sudoku([
    0, 0, 0, /**/ 0, 0, 0, /**/ 0, 0, 0,
    0, 0, 0, /**/ 0, 0, 3, /**/ 0, 8, 5,
    0, 0, 1, /**/ 0, 2, 0, /**/ 0, 0, 0,
    /**********************************/
    0, 0, 0, /**/ 5, 0, 7, /**/ 0, 0, 0,
    0, 0, 4, /**/ 0, 0, 0, /**/ 1, 0, 0,
    0, 9, 0, /**/ 0, 0, 0, /**/ 0, 0, 0,
    /**********************************/
    5, 0, 0, /**/ 0, 0, 0, /**/ 0, 7, 3,
    0, 0, 2, /**/ 0, 1, 0, /**/ 0, 0, 0,
    0, 0, 0, /**/ 0, 4, 0, /**/ 0, 0, 9
])

console.log(sudoku.isValid); // Validate the Sudoku puzzle
console.log(sudoku.solve()); // Solve the Sudoku puzzle
```

## Testing

To run the tests, simply execute:

```sh
deno test src/sudoku.test.ts
```

import { assertEquals, AssertionError, assertThrows } from "@std/assert";
import { CellValue, Sudoku } from "./sudoku.ts";

// @deno-fmt-ignore
const validUnsolvedSudoku = new Sudoku([
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
]);

// @deno-fmt-ignore
const validSolvedSudoku = new Sudoku([
    9, 8, 7, /**/ 6, 5, 4, /**/ 3, 2, 1,
    2, 4, 6, /**/ 1, 7, 3, /**/ 9, 8, 5,
    3, 5, 1, /**/ 9, 2, 8, /**/ 7, 4, 6,
    /**********************************/
    1, 2, 8, /**/ 5, 3, 7, /**/ 6, 9, 4,
    6, 3, 4, /**/ 8, 9, 2, /**/ 1, 5, 7,
    7, 9, 5, /**/ 4, 6, 1, /**/ 8, 3, 2,
    /**********************************/
    5, 1, 9, /**/ 2, 8, 6, /**/ 4, 7, 3,
    4, 7, 2, /**/ 3, 1, 9, /**/ 5, 6, 8,
    8, 6, 3, /**/ 7, 4, 5, /**/ 2, 1, 9,
])

Deno.test("Sudoku with valid cells", () => {
    assertEquals(validUnsolvedSudoku.isValid, true);
});

Deno.test("Sudoku init with invalid cells", () => {
    const cells = Array.from({ length: 9 * 9 }, () => 10);
    assertThrows(() => new Sudoku(cells as CellValue[]), AssertionError);
});

Deno.test("Sudoku.isSolved should be true for a solved Sudoku", () => {
    assertEquals(validSolvedSudoku.isSolved, true);
});

Deno.test("Sudoku.isSolved should be false for an unsolved Sudoku", () => {
    assertEquals(validUnsolvedSudoku.isSolved, false);
});

Deno.test("Sudoku.isValid should be true for a valid Sudoku", () => {
    assertEquals(validSolvedSudoku.isValid, true);
});

Deno.test("Sudoku.random generates a solvable Sudoku", () => {
    assertEquals(Sudoku.random().solve(), true);
});

Deno.test("Sudoku.encode and Sudoku.decode should be inverses", () => {
    const sudoku = validSolvedSudoku;
    const encoded = sudoku.encode();
    const decoded = Sudoku.decode(encoded);

    assertEquals(decoded.toString(), sudoku.toString());
});

Deno.test("Sudoku.computeNumSolutions should return 1 for a uniquely solvable puzzle", () => {
    assertEquals(validUnsolvedSudoku.computeNumSolutions(2), 1);
});

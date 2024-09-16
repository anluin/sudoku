import { decodeBase64, encodeBase64 } from "jsr:@std/encoding";
import { bold, green } from "@std/fmt/colors";
import { assert } from "@std/assert";

export type CellValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// deno-fmt-ignore
const neighborsOf = [
    [  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 18, 19, 20, 27, 36, 45, 54, 63, 72 ],
    [  0,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 18, 19, 20, 28, 37, 46, 55, 64, 73 ],
    [  0,  1,  3,  4,  5,  6,  7,  8,  9, 10, 11, 18, 19, 20, 29, 38, 47, 56, 65, 74 ],
    [  0,  1,  2,  4,  5,  6,  7,  8, 12, 13, 14, 21, 22, 23, 30, 39, 48, 57, 66, 75 ],
    [  0,  1,  2,  3,  5,  6,  7,  8, 12, 13, 14, 21, 22, 23, 31, 40, 49, 58, 67, 76 ],
    [  0,  1,  2,  3,  4,  6,  7,  8, 12, 13, 14, 21, 22, 23, 32, 41, 50, 59, 68, 77 ],
    [  0,  1,  2,  3,  4,  5,  7,  8, 15, 16, 17, 24, 25, 26, 33, 42, 51, 60, 69, 78 ],
    [  0,  1,  2,  3,  4,  5,  6,  8, 15, 16, 17, 24, 25, 26, 34, 43, 52, 61, 70, 79 ],
    [  0,  1,  2,  3,  4,  5,  6,  7, 15, 16, 17, 24, 25, 26, 35, 44, 53, 62, 71, 80 ],
    [  0,  1,  2, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 27, 36, 45, 54, 63, 72 ],
    [  0,  1,  2,  9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 28, 37, 46, 55, 64, 73 ],
    [  0,  1,  2,  9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 29, 38, 47, 56, 65, 74 ],
    [  3,  4,  5,  9, 10, 11, 13, 14, 15, 16, 17, 21, 22, 23, 30, 39, 48, 57, 66, 75 ],
    [  3,  4,  5,  9, 10, 11, 12, 14, 15, 16, 17, 21, 22, 23, 31, 40, 49, 58, 67, 76 ],
    [  3,  4,  5,  9, 10, 11, 12, 13, 15, 16, 17, 21, 22, 23, 32, 41, 50, 59, 68, 77 ],
    [  6,  7,  8,  9, 10, 11, 12, 13, 14, 16, 17, 24, 25, 26, 33, 42, 51, 60, 69, 78 ],
    [  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 17, 24, 25, 26, 34, 43, 52, 61, 70, 79 ],
    [  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 24, 25, 26, 35, 44, 53, 62, 71, 80 ],
    [  0,  1,  2,  9, 10, 11, 19, 20, 21, 22, 23, 24, 25, 26, 27, 36, 45, 54, 63, 72 ],
    [  0,  1,  2,  9, 10, 11, 18, 20, 21, 22, 23, 24, 25, 26, 28, 37, 46, 55, 64, 73 ],
    [  0,  1,  2,  9, 10, 11, 18, 19, 21, 22, 23, 24, 25, 26, 29, 38, 47, 56, 65, 74 ],
    [  3,  4,  5, 12, 13, 14, 18, 19, 20, 22, 23, 24, 25, 26, 30, 39, 48, 57, 66, 75 ],
    [  3,  4,  5, 12, 13, 14, 18, 19, 20, 21, 23, 24, 25, 26, 31, 40, 49, 58, 67, 76 ],
    [  3,  4,  5, 12, 13, 14, 18, 19, 20, 21, 22, 24, 25, 26, 32, 41, 50, 59, 68, 77 ],
    [  6,  7,  8, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 26, 33, 42, 51, 60, 69, 78 ],
    [  6,  7,  8, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 26, 34, 43, 52, 61, 70, 79 ],
    [  6,  7,  8, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 35, 44, 53, 62, 71, 80 ],
    [  0,  9, 18, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 45, 46, 47, 54, 63, 72 ],
    [  1, 10, 19, 27, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 45, 46, 47, 55, 64, 73 ],
    [  2, 11, 20, 27, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38, 45, 46, 47, 56, 65, 74 ],
    [  3, 12, 21, 27, 28, 29, 31, 32, 33, 34, 35, 39, 40, 41, 48, 49, 50, 57, 66, 75 ],
    [  4, 13, 22, 27, 28, 29, 30, 32, 33, 34, 35, 39, 40, 41, 48, 49, 50, 58, 67, 76 ],
    [  5, 14, 23, 27, 28, 29, 30, 31, 33, 34, 35, 39, 40, 41, 48, 49, 50, 59, 68, 77 ],
    [  6, 15, 24, 27, 28, 29, 30, 31, 32, 34, 35, 42, 43, 44, 51, 52, 53, 60, 69, 78 ],
    [  7, 16, 25, 27, 28, 29, 30, 31, 32, 33, 35, 42, 43, 44, 51, 52, 53, 61, 70, 79 ],
    [  8, 17, 26, 27, 28, 29, 30, 31, 32, 33, 34, 42, 43, 44, 51, 52, 53, 62, 71, 80 ],
    [  0,  9, 18, 27, 28, 29, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 54, 63, 72 ],
    [  1, 10, 19, 27, 28, 29, 36, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 55, 64, 73 ],
    [  2, 11, 20, 27, 28, 29, 36, 37, 39, 40, 41, 42, 43, 44, 45, 46, 47, 56, 65, 74 ],
    [  3, 12, 21, 30, 31, 32, 36, 37, 38, 40, 41, 42, 43, 44, 48, 49, 50, 57, 66, 75 ],
    [  4, 13, 22, 30, 31, 32, 36, 37, 38, 39, 41, 42, 43, 44, 48, 49, 50, 58, 67, 76 ],
    [  5, 14, 23, 30, 31, 32, 36, 37, 38, 39, 40, 42, 43, 44, 48, 49, 50, 59, 68, 77 ],
    [  6, 15, 24, 33, 34, 35, 36, 37, 38, 39, 40, 41, 43, 44, 51, 52, 53, 60, 69, 78 ],
    [  7, 16, 25, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 44, 51, 52, 53, 61, 70, 79 ],
    [  8, 17, 26, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 51, 52, 53, 62, 71, 80 ],
    [  0,  9, 18, 27, 28, 29, 36, 37, 38, 46, 47, 48, 49, 50, 51, 52, 53, 54, 63, 72 ],
    [  1, 10, 19, 27, 28, 29, 36, 37, 38, 45, 47, 48, 49, 50, 51, 52, 53, 55, 64, 73 ],
    [  2, 11, 20, 27, 28, 29, 36, 37, 38, 45, 46, 48, 49, 50, 51, 52, 53, 56, 65, 74 ],
    [  3, 12, 21, 30, 31, 32, 39, 40, 41, 45, 46, 47, 49, 50, 51, 52, 53, 57, 66, 75 ],
    [  4, 13, 22, 30, 31, 32, 39, 40, 41, 45, 46, 47, 48, 50, 51, 52, 53, 58, 67, 76 ],
    [  5, 14, 23, 30, 31, 32, 39, 40, 41, 45, 46, 47, 48, 49, 51, 52, 53, 59, 68, 77 ],
    [  6, 15, 24, 33, 34, 35, 42, 43, 44, 45, 46, 47, 48, 49, 50, 52, 53, 60, 69, 78 ],
    [  7, 16, 25, 33, 34, 35, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 53, 61, 70, 79 ],
    [  8, 17, 26, 33, 34, 35, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 62, 71, 80 ],
    [  0,  9, 18, 27, 36, 45, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 72, 73, 74 ],
    [  1, 10, 19, 28, 37, 46, 54, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 72, 73, 74 ],
    [  2, 11, 20, 29, 38, 47, 54, 55, 57, 58, 59, 60, 61, 62, 63, 64, 65, 72, 73, 74 ],
    [  3, 12, 21, 30, 39, 48, 54, 55, 56, 58, 59, 60, 61, 62, 66, 67, 68, 75, 76, 77 ],
    [  4, 13, 22, 31, 40, 49, 54, 55, 56, 57, 59, 60, 61, 62, 66, 67, 68, 75, 76, 77 ],
    [  5, 14, 23, 32, 41, 50, 54, 55, 56, 57, 58, 60, 61, 62, 66, 67, 68, 75, 76, 77 ],
    [  6, 15, 24, 33, 42, 51, 54, 55, 56, 57, 58, 59, 61, 62, 69, 70, 71, 78, 79, 80 ],
    [  7, 16, 25, 34, 43, 52, 54, 55, 56, 57, 58, 59, 60, 62, 69, 70, 71, 78, 79, 80 ],
    [  8, 17, 26, 35, 44, 53, 54, 55, 56, 57, 58, 59, 60, 61, 69, 70, 71, 78, 79, 80 ],
    [  0,  9, 18, 27, 36, 45, 54, 55, 56, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74 ],
    [  1, 10, 19, 28, 37, 46, 54, 55, 56, 63, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74 ],
    [  2, 11, 20, 29, 38, 47, 54, 55, 56, 63, 64, 66, 67, 68, 69, 70, 71, 72, 73, 74 ],
    [  3, 12, 21, 30, 39, 48, 57, 58, 59, 63, 64, 65, 67, 68, 69, 70, 71, 75, 76, 77 ],
    [  4, 13, 22, 31, 40, 49, 57, 58, 59, 63, 64, 65, 66, 68, 69, 70, 71, 75, 76, 77 ],
    [  5, 14, 23, 32, 41, 50, 57, 58, 59, 63, 64, 65, 66, 67, 69, 70, 71, 75, 76, 77 ],
    [  6, 15, 24, 33, 42, 51, 60, 61, 62, 63, 64, 65, 66, 67, 68, 70, 71, 78, 79, 80 ],
    [  7, 16, 25, 34, 43, 52, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 78, 79, 80 ],
    [  8, 17, 26, 35, 44, 53, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 78, 79, 80 ],
    [  0,  9, 18, 27, 36, 45, 54, 55, 56, 63, 64, 65, 73, 74, 75, 76, 77, 78, 79, 80 ],
    [  1, 10, 19, 28, 37, 46, 54, 55, 56, 63, 64, 65, 72, 74, 75, 76, 77, 78, 79, 80 ],
    [  2, 11, 20, 29, 38, 47, 54, 55, 56, 63, 64, 65, 72, 73, 75, 76, 77, 78, 79, 80 ],
    [  3, 12, 21, 30, 39, 48, 57, 58, 59, 66, 67, 68, 72, 73, 74, 76, 77, 78, 79, 80 ],
    [  4, 13, 22, 31, 40, 49, 57, 58, 59, 66, 67, 68, 72, 73, 74, 75, 77, 78, 79, 80 ],
    [  5, 14, 23, 32, 41, 50, 57, 58, 59, 66, 67, 68, 72, 73, 74, 75, 76, 78, 79, 80 ],
    [  6, 15, 24, 33, 42, 51, 60, 61, 62, 69, 70, 71, 72, 73, 74, 75, 76, 77, 79, 80 ],
    [  7, 16, 25, 34, 43, 52, 60, 61, 62, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 80 ],
    [  8, 17, 26, 35, 44, 53, 60, 61, 62, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79 ],
];

export class Sudoku {
    readonly #cells: CellValue[];

    constructor(cells: CellValue[]) {
        assert(cells.length === 9 * 9);

        for (let index = 0; index < 9 * 9; index++) {
            assert(cells[index] >= 0 && cells[index] <= 9);
        }

        this.#cells = cells;
    }

    get isSolved() {
        for (let index = 0; index < 9 * 9; index++) {
            if (this.#cells[index] === 0) {
                return false;
            }
        }

        return true;
    }

    #computeNumPossibleValues(index: number) {
        let num = 0;

        outerLoop:
            for (let cellValue = 1; cellValue < 10; ++cellValue) {
                for (
                    let neighborsOfIndex = 0;
                    neighborsOfIndex < 20;
                    ++neighborsOfIndex
                ) {
                    if (
                        this.#cells[neighborsOf[index][neighborsOfIndex]] ===
                        cellValue
                    ) {
                        continue outerLoop;
                    }
                }

                num += 1;
            }

        return num;
    }

    *#computePossibleValues(index: number, cellValue = 0) {
        outerLoop:
            for (cellValue++; cellValue < 10; ++cellValue) {
                for (const neighborIndex of neighborsOf[index]) {
                    if (this.#cells[neighborIndex] === cellValue) {
                        continue outerLoop;
                    }
                }

                yield cellValue as CellValue;
            }
    }

    get isValid() {
        outerLoop:
            for (let index = 0; index < 9 * 9; ++index) {
                for (const possibleValue of this.#computePossibleValues(index)) {
                    if (
                        this.#cells[index] === 0 ||
                        this.#cells[index] === possibleValue
                    ) {
                        continue outerLoop;
                    }
                }

                return false;
            }

        return true;
    }

    #validateTurn(index: number) {
        outerLoop:
            for (
                let neighborsOfIndex = 0;
                neighborsOfIndex < 20;
                ++neighborsOfIndex
            ) {
                const neighborsIndex = neighborsOf[index][neighborsOfIndex];

                for (
                    const possibleValue of this.#computePossibleValues(
                    neighborsIndex,
                )
                    ) {
                    if (
                        this.#cells[neighborsIndex] === 0 ||
                        this.#cells[neighborsIndex] === possibleValue
                    ) {
                        continue outerLoop;
                    }
                }

                return false;
            }

        return true;
    }

    #computeNextTurn(): number {
        let numPossibleValues = Infinity;
        let indexWithLowestPossibleValues: number;

        for (let index = 0; index < 9 * 9; ++index) {
            if (this.#cells[index] !== 0) continue;

            const nextNumPossibleValues = this.#computeNumPossibleValues(index);

            if (nextNumPossibleValues < numPossibleValues) {
                numPossibleValues = nextNumPossibleValues;
                indexWithLowestPossibleValues = index;
            }
        }

        return indexWithLowestPossibleValues!;
    }

    *solutions(timeout = Infinity) {
        if (!this.isValid) throw new Deno.errors.InvalidData("invalid sudoku");

        const turns: number[] = [];

        let nextTurnsIndex = 0;
        let numEmptyCells = 0;

        for (let index = 0; index < 9 * 9; index++) {
            if (this.#cells[index] === 0) {
                numEmptyCells += 1;
            }
        }

        timeout += performance.now();

        yieldLoop:
            do {
                outerLoop:
                    while (numEmptyCells > 0) {
                        innerLoop:
                            for (;;) {
                                if (performance.now() > timeout) {
                                    throw new Deno.errors.TimedOut();
                                }

                                let cellIndex = this.#computeNextTurn();
                                let cellValue = this.#cells[cellIndex];

                                for (
                                    const possibleValue of this.#computePossibleValues(
                                    cellIndex,
                                    cellValue,
                                )
                                    ) {
                                    this.#cells[cellIndex] = possibleValue;

                                    if (this.#validateTurn(cellIndex)) {
                                        turns[nextTurnsIndex++] = cellIndex;
                                        numEmptyCells -= 1;
                                        continue outerLoop;
                                    }
                                }

                                this.#cells[cellIndex] = 0;

                                for (; nextTurnsIndex-- > 0;) {
                                    cellIndex = turns[nextTurnsIndex];
                                    cellValue = this.#cells[cellIndex];

                                    for (
                                        const possibleValue of this.#computePossibleValues(
                                        cellIndex,
                                        cellValue,
                                    )
                                        ) {
                                        this.#cells[cellIndex] = possibleValue;

                                        if (this.#validateTurn(cellIndex)) {
                                            turns[nextTurnsIndex++] = cellIndex;
                                            continue innerLoop;
                                        }
                                    }

                                    this.#cells[cellIndex] = 0;
                                    numEmptyCells += 1;
                                }

                                return;
                            }
                    }

                yield this.clone();

                for (; nextTurnsIndex-- > 0;) {
                    const cellIndex = turns[nextTurnsIndex];
                    const cellValue = this.#cells[cellIndex];

                    for (
                        const possibleValue of this.#computePossibleValues(
                        cellIndex,
                        cellValue,
                    )
                        ) {
                        this.#cells[cellIndex] = possibleValue;

                        if (this.#validateTurn(cellIndex)) {
                            turns[nextTurnsIndex++] = cellIndex;

                            continue yieldLoop;
                        }
                    }

                    this.#cells[cellIndex] = 0;
                    numEmptyCells += 1;
                }
            } while (nextTurnsIndex > 0);
    }

    solve(timeout = Infinity) {
        for (const _ of this.solutions(timeout)) {
            return true;
        }

        return false;
    }

    toSolved(timeout = Infinity) {
        const sudoku = this.clone();
        sudoku.solve(timeout);
        return sudoku;
    }

    clone() {
        return new Sudoku([...this.#cells]);
    }

    toString(diffTo?: Sudoku) {
        let result = "";

        result += "╭───────┬───────┬───────╮\n";

        for (let index = 0; index < 9 * 9; index++) {
            const cellValue = this.#cells[index];

            if (index % 9 === 0) {
                result += "│";
            }

            result += ` ${
                cellValue !== 0
                    ? (
                        diffTo && diffTo.#cells[index] !== cellValue
                            ? bold(green(`${cellValue}`))
                            : cellValue
                    )
                    : "_"
            }`;

            if (index % 9 === 8) {
                result += " │";
            }

            if (index % 27 === 26 && index < 9 * 8) {
                result += "\n├───────┼───────┼───────┤\n";
            } else if (index % 9 === 8) {
                result += "\n";
            } else if (index % 3 === 2) {
                result += " │";
            }
        }

        result += "╰───────┴───────┴───────╯";

        return result;
    }

    computeNumSolutions(maxSolutions = Infinity, timeout = Infinity) {
        const sudoku = this.clone();

        let numSolutions = 0;

        for (const _ of sudoku.solutions(timeout)) {
            numSolutions += 1;

            if (numSolutions >= maxSolutions) {
                break;
            }
        }

        return numSolutions;
    }

    get isAmbiguous() {
        return this.computeNumSolutions(2) > 1;
    }

    static #initRandom() {
        const sudoku = this.empty;

        for (let boxX = 0; boxX < 3; boxX++) {
            for (let boxY = 0; boxY < 3; boxY++) {
                const cellX = Math.random() * 3 | 0;
                const cellY = Math.random() * 3 | 0;
                const cellIndex = (boxY * 3 + cellY) * 9 + (boxX * 3 + cellX);

                for (
                    const possibleValue of sudoku.#computePossibleValues(
                    cellIndex,
                )
                    ) {
                    sudoku.#cells[cellIndex] = possibleValue;
                    break;
                }
            }
        }

        return sudoku;
    }

    static random() {
        let sudoku = this.#initRandom();

        for (;;) {
            try {
                sudoku.solve(10);
                break;
            } catch (error) {
                if (error instanceof Deno.errors.TimedOut) {
                    sudoku = this.#initRandom();
                } else {
                    throw error;
                }
            }
        }

        const backup = sudoku.clone();
        const cellIndices = Array.from(
            { length: 9 * 9 },
            (_, cellIndex) => cellIndex,
        );

        outerLoop:
            for (;;) {
                for (let index = cellIndices.length - 1; index > 0; index--) {
                    const j = Math.floor(Math.random() * (index + 1));

                    [cellIndices[index], cellIndices[j]] = [
                        cellIndices[j],
                        cellIndices[index],
                    ];
                }

                for (const cellIndex of cellIndices) {
                    const cellValue = sudoku.#cells[cellIndex];

                    sudoku.#cells[cellIndex] = 0;

                    try {
                        if (sudoku.computeNumSolutions(2, 10) > 1) {
                            sudoku.#cells[cellIndex] = cellValue;
                        }
                    } catch (error) {
                        if (error instanceof Deno.errors.TimedOut) {
                            sudoku = backup.clone();
                            continue outerLoop;
                        } else {
                            throw error;
                        }
                    }
                }

                break;
            }

        return sudoku;
    }

    static get empty() {
        return new Sudoku(Array.from(
            { length: 9 * 9 },
            () => 0,
        ));
    }

    encode() {
        const bytes = new Uint8Array(41);

        for (let cellIndex = 0; cellIndex < 9 * 9; ++cellIndex) {
            bytes[(cellIndex / 2 | 0) + cellIndex % 2] |=
                this.#cells[cellIndex + 0] << (cellIndex % 2 * 4);
        }

        return encodeBase64(bytes);
    }

    static decode(data: string) {
        const bytes = decodeBase64(data);
        const cells = Array.from(
            { length: 9 * 9 },
            () => 0,
        );

        for (let cellIndex = 0; cellIndex < 9 * 9; ++cellIndex) {
            cells[cellIndex] =
                bytes[(cellIndex / 2 | 0) + cellIndex % 2] >>
                (cellIndex % 2 * 4) & 0xf;
        }

        return new Sudoku(cells as CellValue[]);
    }
}

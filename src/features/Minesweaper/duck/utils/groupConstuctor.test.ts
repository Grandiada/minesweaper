import { categorizeCells } from "./groupConstuctor"

describe('Should find correct chances', () => {
    test('Calculate groups from array', () => {
        const condition = [
            //       0     1     2    3
            // 0 [   0,    0,    0, null],
            // 1 [   0,    0,    1, null],
            // 2 [   0,    1,    3, null],
            // 3 [   1,    2, null, null],
            // 4 [null, null, null, null],

            [0, 0, 0, null],
            [0, 0, 1, null],
            [0, 1, 3, null],
            [1, 2, null, null],
            [null, null, null, null],
        ]
        const report = categorizeCells(condition);

        expect(report.safePoints).toHaveLength(2);
        expect(report.safePoints).toContainEqual({ x: 2, y: 4, chance: 0 })
        expect(report.safePoints).toContainEqual({ x: 3, y: 0, chance: 0 })
    })

    test('Calculate groups from array', () => {
        const expected = [
            { x: 2, y: 0, chance: 0.77 },
            { x: 2, y: 1, chance: 0.42 },
            { x: 2, y: 2, chance: 0.42 },
            { x: 1, y: 0, chance: 0.77 },
            { x: 0, y: 0, chance: 0.77 },
            { x: 0, y: 1, chance: 0.42 },
            { x: 0, y: 2, chance: 0.42 },
            { x: 2, y: 1, chance: 0.42 },
            { x: 2, y: 2, chance: 0.42 },
            { x: 2, y: 3, chance: 0.13 },
            { x: 1, y: 3, chance: 0.13 },
            { x: 0, y: 1, chance: 0.42 },
            { x: 0, y: 2, chance: 0.42 },
            { x: 0, y: 3, chance: 0.13 }]

        const condition = categorizeCells([
            [null, null, null],
            [null, 4, null],
            [null, 2, null],
            [null, null, null],
        ]).riskyPoints;

        expect(condition).toEqual(expected)

    })
})
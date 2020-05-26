import { categorizeCells } from "../groupConstuctor"

describe('Should categorize cells', () => {
    test('Calculate groups from field', () => {
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

    test('Calculate chance from field', () => {
        const expected = [
            { x: 2, y: 0, chance: 0.68 },
            { x: 2, y: 1, chance: 0.4 },
            { x: 2, y: 2, chance: 0.4 },
            { x: 1, y: 0, chance: 0.68 },
            { x: 0, y: 0, chance: 0.68 },
            { x: 0, y: 1, chance: 0.4 },
            { x: 0, y: 2, chance: 0.4 },
            { x: 2, y: 1, chance: 0.4 },
            { x: 2, y: 2, chance: 0.4 },
            { x: 2, y: 3, chance: 0.14 },
            { x: 1, y: 3, chance: 0.14 },
            { x: 0, y: 1, chance: 0.4 },
            { x: 0, y: 2, chance: 0.4 },
            { x: 0, y: 3, chance: 0.14 }]

        const condition = categorizeCells([
            [null, null, null],
            [null, 4, null],
            [null, 2, null],
            [null, null, null],
        ]).riskyPoints;

        expect(condition).toEqual(expected)

    })

    test('Calculate mined cells from field', () => {
        const condition = [

            [null, null, null],
            [null, null, 3],
        ]

        const report = categorizeCells(condition);
        expect(report.riskyPoints).toHaveLength(0);
        expect(report.safePoints).toHaveLength(0);
        expect(report.minedPoints).toHaveLength(3);
    })

    test('Calculate safe cells from array', () => {
        const condition = [
            //       0     1     2    3    4      5
            // 0 [null, null, null, null, null, null],
            // 1 [null,    2,    1,    3, null, null],
            // 2 [null,    1,    0,    1,    2, null],
            // 3 [null,    1,    0,    0,    1,    1],

            [null, null, null, null, null, null],
            [null, 2, 1, 3, null, null],
            [null, 1, 0, 1, 2, null],
            [null, 1, 0, 0, 1, 1],
        ]

        const report = categorizeCells(condition);

        const expected = [{ x: 3, y: 0, chance: 0 },
        { x: 0, y: 1, chance: 0 },
        { x: 5, y: 1, chance: 0 },
        { x: 1, y: 0, chance: 0 },
        ]
        expect(report.safePoints).toEqual(expected);

    })
})
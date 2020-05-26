import { arrayParser } from "../arrayParser";

describe('Should parse map', () => {
    test('Should parse empty map', () => {
        const condition = `
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
`;
        const parsedMap = arrayParser(condition);
        const expected = [
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
        ]

        expect(parsedMap).toEqual(expected);

    })

    test('Should parse not empty map', () => {
        const condition = `
□□□□□□□□□□
□□□□□□□□□□
1222□□□□□□
0001□□□□□□
00011□□□□□
00001□1□□□
11001□□□□□
□2213□□□□□
□□□□□□□□□□
□□□□□□□□□□
`
        const parsedMap = arrayParser(condition);
        const expected = [
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [1, 2, 2, 2, null, null, null, null, null, null],
            [0, 0, 0, 1, null, null, null, null, null, null],
            [0, 0, 0, 1, 1, null, null, null, null, null],
            [0, 0, 0, 0, 1, null, 1, null, null, null],
            [1, 1, 0, 0, 1, null, null, null, null, null],
            [null, 2, 2, 1, 3, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
        ]

        expect(parsedMap).toEqual(expected);

    })
})
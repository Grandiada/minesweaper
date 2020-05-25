import { equalsGroups } from "./groupConstuctor"


test('arrayEquals', () => {
    expect(equalsGroups([{ x: 1, y: 1, chance: 0 }], [{ x: 1, y: 1, chance: 0 }])).toBe(true)
})
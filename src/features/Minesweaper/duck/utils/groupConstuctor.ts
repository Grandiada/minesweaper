interface IPoint {
    x: number;
    y: number;
    chance: number;
}

interface ICategorizedCells {
    safePoints: IPoint[];
    minedPoints: IPoint[];
    riskyPoints: IPoint[];
}

interface IGroupDescription {
    mines: number;
    group: IPoint[];
}

export const categorizeCells = (field: (number | null)[][]): ICategorizedCells => {
    const groups: ICategorizedCells = {
        safePoints: [],
        minedPoints: [],
        riskyPoints: [],
    }
    const rawGroups: IGroupDescription[] = [];

    for (let i = 0; i < field.length; i++)
        for (let j = 0; j < field[i].length; j++) {
            const point = { x: j, y: i, chance: 0 };
            const mines = field[i][j];
            if (mines === null || mines === 0)
                continue;
            else
                rawGroups.push({
                    mines, group: createGroupFromPoint(field, point)
                })
        }

    if (rawGroups.length === 0)
        return groups;

    let repeat = true;

    do {
        repeat = false;

        for (let i = 0; i < rawGroups.length - 1; i++) {
            const groupI = rawGroups[i];
            // сравниваем ее с остальными меньшими группами
            for (let j = i + 1; j < rawGroups.length; j++) {
                const groupJ = rawGroups[j];

                // удаляем одинаковые группы
                if (equalsGroups(groupI.group, groupJ.group)) {
                    rawGroups.splice(j, 1);
                    break;
                }

                let parent: IGroupDescription; // большая группа
                let child: IGroupDescription; // меньшая группа


                if (groupI.group.length > groupJ.group.length) { // определяем большую и меньшую группы по кол-ву ячеек
                    parent = groupI; child = groupJ;
                }
                else {
                    child = groupI; parent = groupJ;
                }

                if (groupContains(parent.group, child.group)) {  // если большая содержит меньшую
                    subtractGroup(parent, child);
                    repeat = true;
                } else if (groupOverlaps(groupI.group, groupJ.group)) {
                    if (groupI.mines > groupJ.mines) {// определяем большую и меньшую группы по кол-ву мин
                        parent = groupI; child = groupJ;
                    }
                    else {
                        child = groupI; parent = groupJ;
                    }
                    const overlap = getGroupOverlap(parent.group, child.group);
                    const newGroup: IGroupDescription = {
                        group: overlap,
                        mines: parent.mines - child.group.length - overlap.length,
                    }
                    if (newGroup.mines !== child.mines) {
                        break;
                    } else {
                        rawGroups.push(newGroup);
                        subtractGroup(parent, newGroup);
                        subtractGroup(child, newGroup);
                        repeat = true;
                    }
                }
            }
        }
    } while (repeat);

    setCellChances(rawGroups);

    groups.safePoints = rawGroups.filter((i) => i.mines === 0).reduce((accumulator, currentValue) => {

        return [...accumulator, ...currentValue.group.filter((m) => m.chance === 0)];
    }, [])

    groups.riskyPoints = rawGroups.filter((i) => i.mines !== 0 && i.mines < i.group.length).reduce((accumulator, currentValue) => {
        return [...accumulator, ...currentValue.group];
    }, [])

    groups.minedPoints = rawGroups.filter((i) => i.mines === i.group.length).reduce((accumulator, currentValue) => {
        return [...accumulator, ...currentValue.group];
    }, [])

    console.log(rawGroups);
    return groups;
}

export const setCellChances = (groups: IGroupDescription[]) => {
    const map = new Map<string, number>();

    for (const group of groups) {
        for (const cell of group.group) {
            const value = map.get(pointToString(cell))
            if (value === undefined) {// если ячейка еще не в мапе
                map.set(pointToString(cell), group.mines / group.group.length); // то добавляем ее со значением из группы
            } else { //если она уже в мапе, то корректируем ее значение по теории вероятности
                map.set(pointToString(cell), 1 - (1 - value) * (1 - group.mines / group.group.length));
            }
        }
    }
    let repeat = true;
    do {
        repeat = false;
        for (const group of groups) {

            const sum = group.group.reduce((accumulator, currentValue) => {
                const value = map.get(pointToString(currentValue));
                if (value || value === 0)
                    return accumulator + value;
                else
                    throw new Error();
            }, 0)

            const mines = group.mines;
            if (Math.abs(sum - mines) > 1) {
                repeat = true;

                const coef = group.mines / sum;

                //correct
                for (const cell of group.group) {
                    const value = map.get(pointToString(cell));
                    if (value || value === 0)
                        map.set(pointToString(cell), value * coef);
                    else
                        throw new Error();
                }
            }

        }

    } while (repeat);

    for (const group of groups) {
        for (const cell of group.group) {
            let value = map.get(pointToString(cell));
            if (value || value === 0) {
                if (value > 0.99) value = 0.99;
                if (value < 0) value = 0;
                cell.chance = value;
            } else
                throw new Error();

        }
    }
}

export const createGroupFromPoint = (field: (number | null)[][], point: IPoint): IPoint[] => {
    const group: IPoint[] = [];


    //
    if (field[point.y - 1] && field[point.y - 1][point.x + 1] === null)
        group.push({ x: point.x + 1, y: point.y - 1, chance: 0 });

    if (field[point.y] && field[point.y][point.x + 1] === null)
        group.push({ x: point.x + 1, y: point.y, chance: 0 });

    if (field[point.y + 1] && field[point.y + 1][point.x + 1] === null)
        group.push({ x: point.x + 1, y: point.y + 1, chance: 0 });

    if (field[point.y - 1] && field[point.y - 1][point.x] === null)
        group.push({ x: point.x, y: point.y - 1, chance: 0 });

    if (field[point.y + 1] && field[point.y + 1][point.x] === null)
        group.push({ x: point.x, y: point.y + 1, chance: 0 });

    if (field[point.y - 1] && field[point.y - 1][point.x - 1] === null)
        group.push({ x: point.x - 1, y: point.y - 1, chance: 0 });

    if (field[point.y] && field[point.y][point.x - 1] === null)
        group.push({ x: point.x - 1, y: point.y, chance: 0 });

    if (field[point.y + 1] && field[point.y + 1][point.x - 1] === null)
        group.push({ x: point.x - 1, y: point.y + 1, chance: 0 });

    return group;
}

export const pointToString = (point: IPoint): string => {
    return `x:${point.x},y:${point.y}`
}

export const equalsGroups = (a: IPoint[], b: IPoint[]) => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    const sortFunction = (a: IPoint, b: IPoint): number => {
        if (a.x > b.x) {
            return 1;
        }
        if (a.x < b.x) {
            return -1;
        }
        if (a.y > b.y) {
            return 1;
        }
        if (a.y < b.y) {
            return -1;
        }
        return 0;
    }

    const sortedA = [...a].sort(sortFunction);
    const sortedB = [...b].sort(sortFunction);

    for (let i = 0; i < sortedA.length; ++i) {
        if (sortedA[i].x !== sortedB[i].x) return false;
        if (sortedA[i].y !== sortedB[i].y) return false;
    }
    return true;
}

export const groupContains = (parrentArray: IPoint[], childArray: IPoint[]): boolean => {
    for (const child of childArray) {
        if (!!!parrentArray.find((m) => m.x === child.x && m.y === child.y))
            return false;
    }

    return true;
}

export const groupOverlaps = (firstArray: IPoint[], secondArray: IPoint[]): boolean => {
    for (const item of secondArray) {
        if (firstArray.find((m) => m.x === item.x && m.y === item.y))
            return true;
    }

    return false;
}

export const subtractGroup = (first: IGroupDescription, second: IGroupDescription) => {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < second.group.length; i++) {
        const index = first.group.findIndex((m) => { return m.x === second.group[i].x && m.y === second.group[i].y })
        if (index !== -1)
            first.group.splice(index, 1);
    }
    first.mines -= second.mines;
}

const getGroupOverlap = (parent: IPoint[], child: IPoint[]): IPoint[] => {
    const overlap: IPoint[] = [];
    for (const item of child) {
        const element = parent.find((m) => m.x === item.x && m.y === item.y)
        if (element) {
            overlap.push({ ...element })
        }
    }

    return overlap;
}

interface IPoint {
    x: number;
    y: number;
}

interface IGroups {
    safePoints: IPoint[];
    minedPoints: IPoint[];
    riskyPoints: IPoint[];
}

interface GroupDescription {
    mines: number;
    group: IPoint[];
}

export const constructGroupds = (field: (number | null)[][]): IGroups => {
    const groups: IGroups = {
        safePoints: [],
        minedPoints: [],
        riskyPoints: [],
    }
    const rawGroups: GroupDescription[] = [];

    for (let i = 0; i < field.length; i++)
        for (let j = 0; j < field[i].length; j++) {
            const point = { x: j, y: i };
            const mines = field[i][j];
            if (mines === null || mines === 0)
                continue;
            else
                rawGroups.push({
                    mines, group: formGroup(field, point)
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
                if (arraysEqual(groupI.group, groupJ.group)) {
                    rawGroups.splice(j, 1);
                    break;
                }

                let parent: GroupDescription; // большая группа
                let child: GroupDescription; // меньшая группа


                if (groupI.group.length > groupJ.group.length) { // определяем большую и меньшую группы по кол-ву ячеек
                    parent = groupI; child = groupJ;
                }
                else {
                    child = groupI; parent = groupJ;
                }

                if (parentContainsChild(parent.group, child.group)) {  // если большая содержит меньшую
                    subtractArray(parent, child);
                    repeat = true;
                } else if (overlaps(groupI.group, groupJ.group)) {
                    if (groupI.mines > groupJ.mines) {// определяем большую и меньшую группы по кол-ву мин
                        parent = groupI; child = groupJ;
                    }
                    else {
                        child = groupI; parent = groupJ;
                    }
                    const overlap = getOverlap(parent.group, child.group);
                    const newGroup: GroupDescription = {
                        group: overlap,
                        mines: parent.mines - child.group.length - overlap.length,
                    }
                    if (newGroup.mines !== child.mines) {
                        break;
                    } else {
                        rawGroups.push(newGroup);
                        subtractArray(parent, newGroup);
                        subtractArray(child, newGroup);
                        repeat = true;
                    }
                }
            }
        }
    } while (repeat);

    groups.safePoints = rawGroups.filter((i) => i.mines === 0).reduce((accumulator, currentValue) => {
        return [...accumulator, ...currentValue.group];
    }, [])

    groups.riskyPoints = rawGroups.filter((i) => i.mines !== 0 && i.mines !== i.group.length).reduce((accumulator, currentValue) => {
        return [...accumulator, ...currentValue.group];
    }, [])

    groups.minedPoints = rawGroups.filter((i) => i.mines === i.group.length).reduce((accumulator, currentValue) => {
        return [...accumulator, ...currentValue.group];
    }, [])

    return groups;
}

const formGroup = (field: (number | null)[][], point: IPoint): IPoint[] => {
    const group: IPoint[] = [];


    //
    if (field[point.y - 1] && field[point.y - 1][point.x + 1] === null)
        group.push({ x: point.x + 1, y: point.y - 1 });

    if (field[point.y] && field[point.y][point.x + 1] === null)
        group.push({ x: point.x + 1, y: point.y });

    if (field[point.y + 1] && field[point.y + 1][point.x + 1] === null)
        group.push({ x: point.x + 1, y: point.y + 1 });

    if (field[point.y - 1] && field[point.y - 1][point.x] === null)
        group.push({ x: point.x, y: point.y - 1 });

    if (field[point.y + 1] && field[point.y + 1][point.x] === null)
        group.push({ x: point.x, y: point.y + 1 });

    if (field[point.y - 1] && field[point.y - 1][point.x - 1] === null)
        group.push({ x: point.x - 1, y: point.y - 1 });

    if (field[point.y] && field[point.y][point.x - 1] === null)
        group.push({ x: point.x - 1, y: point.y });

    if (field[point.y + 1] && field[point.y + 1][point.x - 1] === null)
        group.push({ x: point.x - 1, y: point.y + 1 });

    return group;
}


const arraysEqual = (a: IPoint[], b: IPoint[]) => {
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

const parentContainsChild = (parrentArray: IPoint[], childArray: IPoint[]): boolean => {
    for (const child of childArray) {
        if (!!!parrentArray.find((m) => m.x === child.x && m.y === child.y))
            return false;
    }

    return true;
}

const overlaps = (firstArray: IPoint[], secondArray: IPoint[]): boolean => {
    for (const item of secondArray) {
        if (firstArray.find((m) => m.x === item.x && m.y === item.y))
            return true;
    }

    return false;
}

const subtractArray = (first: GroupDescription, second: GroupDescription) => {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < second.group.length; i++) {
        const index = first.group.findIndex((m) => { return m.x === second.group[i].x && m.y === second.group[i].y })
        if (index !== -1)
            first.group.splice(index, 1);
    }
    first.mines -= second.mines;
}

const getOverlap = (parent: IPoint[], child: IPoint[]): IPoint[] => {
    const overlap: IPoint[] = [];
    for (const item of child) {
        const element = parent.find((m) => m.x === item.x && m.y === item.y)
        if (element) {
            overlap.push({ ...element })
        }
    }

    return overlap;
}
export const arrayParser = (array: string): (number | null)[][] => {
    const parsedArray = array.split('\n').filter(Boolean).map((i) =>
        Array.from(i).map((m) => {
            // tslint:disable-next-line: radix
            const num = parseInt(m)
            if (!isNaN(num))
                return num;
            else
                return null
        })
    );
    return parsedArray;
}
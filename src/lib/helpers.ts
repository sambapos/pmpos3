export const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

export const vibrate = (pattern: number | number[]) => {
    if (navigator.vibrate) {
        navigator.vibrate(pattern);
    }
}
export default (data: string) => {
    let result = {};
    data.split(',').map(x => {
        let parts = x.split(':');
        result[parts[0]] = parts[1];
        return result;
    });
    return JSON.stringify(result);
};
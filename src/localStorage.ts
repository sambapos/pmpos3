import * as transit from 'transit-immutable-js';

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) {
            return undefined;
        }
        let result = transit.fromJSON(serializedState);
        return result;
    } catch (err) {
        return undefined;
    }
};

export const saveState = (state) => {
    try {
        const serializedState = transit.toJSON(state);
        localStorage.setItem('state', serializedState);
    } catch (err) {
        // Ignore
    }
};
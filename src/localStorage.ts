import * as transit from 'transit-immutable-js';

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) {
            return undefined;
        }
        return transit.fromJSON(serializedState);
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
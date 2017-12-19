import { Reducer } from 'redux';

export interface ClientState {
    languageName: string;
    enthusiasmLevel: number;
    drawerOpen: boolean;
}

interface IncrementEnthusiasmAction {
    type: 'INCREMENT_ENTHUSIASM';
}

interface DecrementEnthusiasmAction {
    type: 'DECREMENT_ENTHUSIASM';
}

interface ToggleDrawerAction {
    type: 'TOGGLE_DRAWER';
    forceClose: boolean;
}

type KnownAction = IncrementEnthusiasmAction |
    DecrementEnthusiasmAction | ToggleDrawerAction;

export const actionCreators = {
    IncrementEnthusiasm: () => <IncrementEnthusiasmAction>{ type: 'INCREMENT_ENTHUSIASM' },
    DecrementEnthusiasm: () => <DecrementEnthusiasmAction>{ type: 'DECREMENT_ENTHUSIASM' },
    ToggleDrawer: (forceClose?: boolean) => <ToggleDrawerAction>{ type: 'TOGGLE_DRAWER', forceClose },
};

const unloadedState: ClientState = {
    languageName: 'aa',
    enthusiasmLevel: 1,
    drawerOpen: false
};

export const reducer: Reducer<ClientState> = (state: ClientState, action: KnownAction) => {
    switch (action.type) {
        case 'INCREMENT_ENTHUSIASM':
            return { ...state, enthusiasmLevel: state.enthusiasmLevel + 1 };
        case 'DECREMENT_ENTHUSIASM':
            return { ...state, enthusiasmLevel: Math.max(1, state.enthusiasmLevel - 1) };
        case 'TOGGLE_DRAWER':
            return { ...state, drawerOpen: !action.forceClose && !state.drawerOpen };
        default: return state || unloadedState;
    }
};

import { Reducer } from 'redux';

export interface ClientState {
    languageName: string;
    enthusiasmLevel: number;
    documents: Document[];
}

interface IncrementEnthusiasmAction {
    type: 'INCREMENT_ENTHUSIASM';
}

interface DecrementEnthusiasmAction {
    type: 'DECREMENT_ENTHUSIASM';
}

type KnownAction = IncrementEnthusiasmAction |
    DecrementEnthusiasmAction;

export const actionCreators = {
    IncrementEnthusiasm: () => <IncrementEnthusiasmAction>{ type: 'INCREMENT_ENTHUSIASM' },
    DecrementEnthusiasm: () => <DecrementEnthusiasmAction>{ type: 'DECREMENT_ENTHUSIASM' },
};

const unloadedState: ClientState = {
    languageName: 'aa',
    enthusiasmLevel: 1,
    documents: []
};

export const reducer: Reducer<ClientState> = (state: ClientState, action: KnownAction) => {
    switch (action.type) {
        case 'INCREMENT_ENTHUSIASM':
            return { ...state, enthusiasmLevel: state.enthusiasmLevel + 1 };
        case 'DECREMENT_ENTHUSIASM':
            return { ...state, enthusiasmLevel: Math.max(1, state.enthusiasmLevel - 1) };
        default: return state || unloadedState;
    }
};

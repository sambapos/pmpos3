import { Reducer } from 'redux';
import * as React from 'react';
import { AppThunkAction } from './appThunkAction';
import { configureProtocol } from 'pmpos-modules';
import { CardsManager } from 'pmpos-modules';

export interface ClientState {
    languageName: string;
    drawerOpen: boolean;
    loggedInUser: string;
    terminalId: string;
    networkName: string;
    serverName: string;
    modalComponent: JSX.Element;
    modalOpen: boolean;
}

interface ToggleDrawerAction {
    type: 'TOGGLE_DRAWER';
    forceClose: boolean;
}

interface SetLoggedInUserAction {
    type: 'SET_LOGGEDIN_USER';
    user: string;
}

interface SetTerminalIdAction {
    type: 'SET_TERMINAL_ID';
    terminalId: string;
    networkName: string;
    serverName: string;
}

interface SetModalStateAction {
    type: 'SET_MODAL_STATE';
    visible: boolean;
}

interface SetModalComponentAction {
    type: 'SET_MODAL_COMPONENT';
    component: any;
}

type KnownActions = ToggleDrawerAction | SetModalStateAction | SetModalComponentAction
    | SetLoggedInUserAction | SetTerminalIdAction;

const configProtocol = (terminalId, networkName, serverName, user, dispatch) => {
    configureProtocol(
        serverName,
        true,
        terminalId, networkName, user,
        (chat, commit, config) => {
            dispatch({
                type: 'SET_CONFIG_PROTOCOL',
                protocol: config
            });
            dispatch({
                type: 'SET_COMMIT_PROTOCOL',
                protocol: commit
            });
            dispatch({
                type: 'SET_CHAT_PROTOCOL',
                protocol: chat
            });
        },
        messages =>
            messages.forEach(value =>
                dispatch({
                    type: 'ADD_MESSAGE',
                    time: value.time,
                    message: value.message,
                    user: value.user,
                    id: value.id,
                    lamport: value.lamport
                })),
        config => dispatch({
            type: 'CONFIG_RECEIVED',
            payload: config
        }),
        commits => dispatch({
            type: 'COMMIT_RECEIVED',
            values: commits
        })
    );
};

export const actionCreators = {
    SetLoggedInUser: (user: string) => <SetLoggedInUserAction>{ type: 'SET_LOGGEDIN_USER', user },
    SetTerminalId: (terminalId: string, networkName: string, serverName: string) =>
        <SetTerminalIdAction>{
            type: 'SET_TERMINAL_ID', terminalId, networkName, serverName
        },
    ToggleDrawer: (forceClose?: boolean) => <ToggleDrawerAction>{ type: 'TOGGLE_DRAWER', forceClose },
    SetModalState: (visible: boolean) => <SetModalStateAction>{ type: 'SET_MODAL_STATE', visible },
    SetModalComponent: (component: any) => <SetModalComponentAction>{ type: 'SET_MODAL_COMPONENT', component },
    connectProtocol: (terminalId: string, networkName: string, serverName: string, user: string):
        AppThunkAction<KnownActions> => (dispatch, getState) => {
            let currentProtocol = getState().cards.protocol;
            if (!currentProtocol) {
                configProtocol(terminalId, networkName, serverName, user, dispatch);
            }
            CardsManager.enableTerminal(terminalId, user);
        }
};

const unloadedState: ClientState = {
    languageName: 'aa',
    drawerOpen: false,
    loggedInUser: '',
    terminalId: '',
    networkName: '',
    serverName: '',
    modalComponent: React.createElement('div'),
    modalOpen: false
};

export const reducer: Reducer<ClientState> = (state: ClientState, action: KnownActions) => {
    switch (action.type) {
        case 'TOGGLE_DRAWER':
            return { ...state, drawerOpen: !action.forceClose && !state.drawerOpen };
        case 'SET_LOGGEDIN_USER':
            return { ...state, loggedInUser: action.user };
        case 'SET_TERMINAL_ID':
            localStorage.setItem('terminalId', action.terminalId);
            localStorage.setItem('networkName', action.networkName);
            localStorage.setItem('serverName', action.serverName);
            return {
                ...state,
                terminalId: action.terminalId,
                networkName: action.networkName,
                serverName: action.serverName
            };
        case 'SET_MODAL_STATE':
            return { ...state, modalOpen: action.visible };
        case 'SET_MODAL_COMPONENT':
            return { ...state, modalComponent: action.component, modalOpen: true };
        default: return state || unloadedState;
    }
};

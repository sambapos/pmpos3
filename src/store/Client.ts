import { Reducer } from 'redux';
import * as React from 'react';
import { IAppThunkAction } from './appThunkAction';
import { configureProtocol } from 'pmpos-modules';
import { CardsManager } from 'pmpos-modules';

export interface IClientState {
    languageName: string;
    drawerOpen: boolean;
    loggedInUser: string;
    terminalId: string;
    networkName: string;
    serverName: string;
    modalComponent: JSX.Element;
    modalOpen: boolean;
}

interface IToggleDrawerAction {
    type: 'TOGGLE_DRAWER';
    forceClose: boolean;
}

interface ISetLoggedInUserAction {
    type: 'SET_LOGGEDIN_USER';
    user: string;
}

interface ISetTerminalIdAction {
    type: 'SET_TERMINAL_ID';
    terminalId: string;
    networkName: string;
    serverName: string;
}

interface ISetModalStateAction {
    type: 'SET_MODAL_STATE';
    visible: boolean;
}

interface ISetModalComponentAction {
    type: 'SET_MODAL_COMPONENT';
    component: any;
}

type KnownActions = IToggleDrawerAction | ISetModalStateAction | ISetModalComponentAction
    | ISetLoggedInUserAction | ISetTerminalIdAction;

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
    SetLoggedInUser: (user: string) => <ISetLoggedInUserAction>{ type: 'SET_LOGGEDIN_USER', user },
    SetTerminalId: (terminalId: string, networkName: string, serverName: string) =>
        <ISetTerminalIdAction>{
            type: 'SET_TERMINAL_ID', terminalId, networkName, serverName
        },
    ToggleDrawer: (forceClose?: boolean) => <IToggleDrawerAction>{ type: 'TOGGLE_DRAWER', forceClose },
    SetModalState: (visible: boolean) => <ISetModalStateAction>{ type: 'SET_MODAL_STATE', visible },
    SetModalComponent: (component: any) => <ISetModalComponentAction>{ type: 'SET_MODAL_COMPONENT', component },
    connectProtocol: (terminalId: string, networkName: string, serverName: string, user: string):
        IAppThunkAction<KnownActions> => (dispatch, getState) => {
            const currentProtocol = getState().cards.protocol;
            if (!currentProtocol) {
                configProtocol(terminalId, networkName, serverName, user, dispatch);
            }
            CardsManager.enableTerminal(terminalId, user);
        }
};

const unloadedState: IClientState = {
    languageName: 'aa',
    drawerOpen: false,
    loggedInUser: '',
    terminalId: '',
    networkName: '',
    serverName: '',
    modalComponent: React.createElement('div'),
    modalOpen: false
};

export const reducer: Reducer<IClientState> = (state: IClientState, action: KnownActions) => {
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

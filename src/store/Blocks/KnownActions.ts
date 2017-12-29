import Block from '../../models/Block';

type RegisterBlockActionAction = {
    type: 'REGISTER_BLOCK_ACTION',
    blockId: string
    payload: any
};

type LoadBlockAction = {
    type: 'LOAD_BLOCK'
    blockId: string
    payload: Promise<Block>
};

type LoadBlockSuccessAction = {
    type: 'LOAD_BLOCK_SUCCESS'
    payload: Block
};

type LoadBlockRequestAction = {
    type: 'LOAD_BLOCK_REQUEST'
};

type LoadBlockFailAction = {
    type: 'LOAD_BLOCK_FAIL'
};

type ConnectProtocolAction = {
    type: 'CONNECT_PROTOCOL'
    terminalId: string
    user: string
    payload: Promise<any>
};

type ConnectProtocolRequestAction = {
    type: 'CONNECT_PROTOCOL_REQUEST'
};

type ConnectProtocolSuccessAction = {
    type: 'CONNECT_PROTOCOL_SUCCESS'
    payload: any
};

type ConnectProtocolFailAction = {
    type: 'CONNECT_PROTOCOL_FAIL'
};

type AddMessageAction = {
    type: 'ADD_MESSAGE'
    id: string
    user: string
    message: string
    time: number
};

type CustomAction = {
    blockId: string
    data: any
};

type CreateBlockAction = { type: 'CREATE_BLOCK' } & CustomAction;
type SetBlockTagAction = { type: 'SET_BLOCK_TAG' } & CustomAction;

export type KnownActions = RegisterBlockActionAction | AddMessageAction
    | ConnectProtocolAction | ConnectProtocolRequestAction | ConnectProtocolSuccessAction | ConnectProtocolFailAction
    | LoadBlockAction | LoadBlockRequestAction | LoadBlockSuccessAction | LoadBlockFailAction
    | CreateBlockAction | SetBlockTagAction;

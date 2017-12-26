import { Reducer } from 'redux';
import { fromJS } from 'immutable';
import { AppThunkAction } from './appThunkAction';
import { uuidv4 } from '../lib/uuid';

type AddDocumentAction = {
    type: 'ADD_DOCUMENT'
};

type LoadDocumentAction = {
    type: 'LOAD_DOCUMENT'
    documentId: String
    payload: Promise<Map<any, any>>
};

type LoadDocumentRequestAction = {
    type: 'LOAD_DOCUMENT_REQUEST'
};
type LoadDocumentSuccessAction = {
    type: 'LOAD_DOCUMENT_SUCCESS'
    payload: Map<any, any>
};
type LoadDocumentFailAction = {
    type: 'LOAD_DOCUMENT_FAIL'
};

type AddExchangeAction = {
    type: 'ADD_EXCHANGE',
    documentId: string
};

type KnownActions = AddDocumentAction
    | LoadDocumentAction | LoadDocumentRequestAction | LoadDocumentSuccessAction | LoadDocumentFailAction
    | AddExchangeAction;

export const reducer: Reducer<Map<any, any>> = (
    state: Map<any, any> = fromJS({
        documents: [],
        isInitialized: false,
        document: {}
    }),
    action: KnownActions
) => {
    switch (action.type) {
        case 'ADD_DOCUMENT':
            {
                let doc = fromJS({
                    id: uuidv4(),
                    date: new Date(),
                    exchanges: []
                });
                let docs = state.get('documents').push(doc);
                return state.set('documents', docs);
            }
        case 'LOAD_DOCUMENT_REQUEST': {
            return state
                .set('document', new Map<any, any>())
                .set('isInitialized', false);
        }
        case 'LOAD_DOCUMENT_SUCCESS': {
            let result = state
                .set('document', action.payload)
                .set('isInitialized', true);
            return result;
        }
        case 'LOAD_DOCUMENT_FAIL': {
            return state
                .set('isInitialized', false);
        }
        case 'ADD_EXCHANGE': {
            let newDoc;
            let exchange = fromJS({
                id: uuidv4()
            });
            let docs = state.get('documents').update(
                state.get('documents').findIndex(doc => {
                    return doc ? doc.get('id') === action.documentId : false;
                }),
                doc => {
                    let exchanges = doc.get('exchanges').push(exchange);
                    newDoc = doc.set('exchanges', exchanges);
                    return newDoc;
                }
            );
            return state.set('documents', docs).set('document', newDoc);
        }
        default:
            return state;
    }
};

export const actionCreators = {
    addDocument: (): AppThunkAction<KnownActions> => (dispatch, getState) => {
        dispatch({ type: 'ADD_DOCUMENT' });
    },
    loadDocument: (id: String): AppThunkAction<KnownActions> => (dispatch, getState) => {
        dispatch({
            type: 'LOAD_DOCUMENT', documentId: id,
            payload: new Promise<Map<any, any>>(resolve => {
                let doc = getState().documents.get('documents').find(x => x ? x.get('id') === id : false);
                resolve(new Map(doc));
            })
        });
    },
    addExchange: (documentId: string): AppThunkAction<KnownActions> => (dispatch, getState) => {
        dispatch({ type: 'ADD_EXCHANGE', documentId });
    },
};
import { Reducer } from 'redux';
import { List, fromJS } from 'immutable';
import { makeTypedFactory, TypedRecord } from 'typed-immutable-record';
import { AppThunkAction } from './appThunkAction';
import { uuidv4 } from './uuid';
import Document from '../models/Document';
import Exchange from '../models/Exchange';

interface ExchangeRecord extends TypedRecord<ExchangeRecord>, Exchange { }

export const makeExchange = makeTypedFactory<Exchange, ExchangeRecord>({
    id: ''
});

interface DocumentRecord extends TypedRecord<DocumentRecord>, Document { }

export const makeDocument = makeTypedFactory<Document, DocumentRecord>({
    id: '',
    date: new Date(),
    exchanges: [] as ExchangeRecord[]
});

export interface State {
    documents: List<DocumentRecord>;
    document: DocumentRecord;
    isInitialized: boolean;
}

export interface StateRecord extends TypedRecord<StateRecord>, State { }

export const makeState = makeTypedFactory<State, StateRecord>({
    documents: List<DocumentRecord>(),
    document: makeDocument(),
    isInitialized: false
});

type AddDocumentAction = {
    type: 'ADD_DOCUMENT'
};

type LoadDocumentAction = {
    type: 'LOAD_DOCUMENT'
    documentId: String
    payload: Promise<DocumentRecord>
};

type LoadDocumentRequestAction = {
    type: 'LOAD_DOCUMENT_REQUEST'
};
type LoadDocumentSuccessAction = {
    type: 'LOAD_DOCUMENT_SUCCESS'
    payload: DocumentRecord
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

export const reducer: Reducer<StateRecord> = (
    state: StateRecord = makeState(),
    action: KnownActions
): StateRecord => {
    switch (action.type) {
        case 'ADD_DOCUMENT':
            {
                let doc = makeDocument(fromJS({
                    id: uuidv4(),
                    date: new Date(),
                    exchanges: [] as ExchangeRecord[]
                }));
                console.log(doc);
                let docs = state.documents.push(doc);
                return state.set('documents', docs);
            }
        case 'LOAD_DOCUMENT_REQUEST': {
            return state
                .set('document', makeDocument())
                .set('isInitialized', false);
        }
        case 'LOAD_DOCUMENT_SUCCESS': {
            return state
                .set('document', action.payload)
                .set('isInitialized', true);
        }
        case 'LOAD_DOCUMENT_FAIL': {
            return state
                .set('isInitialized', false);
        }
        case 'ADD_EXCHANGE': {
            let newDoc;
            let exchange = makeExchange(fromJS({
                id: uuidv4()
            }));
            let docs = state.documents.update(
                state.documents.findIndex(doc => {
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
            payload: new Promise<DocumentRecord>(resolve => {
                let doc = getState().documents.documents.find(x => x ? x.id === id : false);
                resolve(doc);
            })
        });
    },
    addExchange: (documentId: string): AppThunkAction<KnownActions> => (dispatch, getState) => {
        dispatch({ type: 'ADD_EXCHANGE', documentId });
    },
};
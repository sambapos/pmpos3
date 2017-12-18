import { Reducer } from 'redux';
import { List } from 'immutable';
import { makeTypedFactory, TypedRecord } from 'typed-immutable-record';
import { AppThunkAction } from './appThunkAction';
import { uuidv4 } from './uuid';
import Document from '../models/Document';

interface DocumentRecord extends TypedRecord<DocumentRecord>, Document { }

const makeDocument = makeTypedFactory<Document, DocumentRecord>({
    id: '',
    date: new Date()
});

export interface State {
    documents: List<DocumentRecord>;
    document: DocumentRecord;
    isInitialized: boolean;
}

interface StateRecord extends TypedRecord<StateRecord>, State { }

const defaultState = makeTypedFactory<State, StateRecord>({
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

type KnownActions = AddDocumentAction
    | LoadDocumentAction | LoadDocumentRequestAction | LoadDocumentSuccessAction | LoadDocumentFailAction;

export const reducer: Reducer<StateRecord> = (
    state: StateRecord = defaultState(),
    action: KnownActions
): StateRecord => {
    switch (action.type) {
        case 'ADD_DOCUMENT':
            {
                let doc = makeDocument({
                    id: uuidv4(),
                    date: new Date()
                });
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
    }
};
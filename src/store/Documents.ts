import { Reducer } from 'redux';
import { List } from 'immutable';
import { makeTypedFactory, TypedRecord } from 'typed-immutable-record';
import { AppThunkAction } from './appThunkAction';
import { uuidv4 } from './uuid';
import Document from '../models/Document';

export interface DocumentRecord extends TypedRecord<DocumentRecord>, Document { }

const makeDocument = makeTypedFactory<Document, DocumentRecord>({
    id: '',
    date: new Date()
});

type AddDocumentAction = {
    type: 'ADD_DOCUMENT'
};

type DocumentsAction = AddDocumentAction;

export const reducer: Reducer<List<DocumentRecord>> = (
    state: List<DocumentRecord> = List<DocumentRecord>(),
    action: DocumentsAction
): List<DocumentRecord> => {
    switch (action.type) {
        case 'ADD_DOCUMENT':
            return state.push(makeDocument({
                id: uuidv4(),
                date: new Date()
            }));
        default:
            return state;
    }
};

export const actionCreators = {
    addDocument: (): AppThunkAction<DocumentsAction> => (dispatch, getState) => {
        dispatch({ type: 'ADD_DOCUMENT' });
    }
};
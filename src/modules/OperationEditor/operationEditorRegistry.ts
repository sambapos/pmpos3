import * as React from 'react';
import { CardRecord } from 'pmpos-models';
import { Map as IMap } from 'immutable';

export default class OperationEditorRegistry {
    _registry: IMap<string, any>;

    constructor() {
        this._registry = IMap<string, any>();
    }

    registerEditor(actionType: string, editor: any) {
        this._registry = this._registry.set(actionType, editor);
    }

    hasEditor(actionType: string) {
        return this._registry.has(actionType);
    }

    getEditor(
        actionType: string,
        card: CardRecord,
        success: (actionType: string, data: any) => void,
        cancel: () => void,
        current?: any): JSX.Element | undefined {
        if (this.hasEditor(actionType)) {
            let editor = this._registry.get(actionType);
            if (editor) {
                return React.createElement(editor, { card, success, cancel, actionName: actionType, current });
            }
        }
        return undefined;
    }
}
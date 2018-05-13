import * as React from 'react';
import { CardRecord } from 'pmpos-models';
import { Map as IMap } from 'immutable';

export default class OperationEditorRegistry {
    private registry: IMap<string, any>;

    constructor() {
        this.registry = IMap<string, any>();
    }

    public registerEditor(actionType: string, editor: any) {
        this.registry = this.registry.set(actionType, editor);
    }

    public hasEditor(actionType: string) {
        return this.registry.has(actionType);
    }

    public getEditor(
        actionType: string,
        card: CardRecord,
        success: (actionType: string, data: any) => void,
        cancel: () => void,
        current?: any): JSX.Element | undefined {
        if (this.hasEditor(actionType)) {
            const editor = this.registry.get(actionType);
            if (editor) {
                return React.createElement(editor, { card, success, cancel, actionName: actionType, current });
            }
        }
        return undefined;
    }
}
import { CardRecord } from 'pmpos-core';

export default interface IEditorProperties<TData> {
    card: CardRecord;
    success: (actionType: string, data: any) => void;
    cancel: () => void;
    actionName: string;
    current?: TData;

}
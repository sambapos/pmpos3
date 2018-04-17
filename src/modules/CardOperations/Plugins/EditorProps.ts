import { CardRecord } from 'pmpos-models';

export interface EditorProps<TData> {
    card: CardRecord;
    success: (actionType: string, data: any) => void;
    cancel: () => void;
    actionName: string;
    current: TData;
}
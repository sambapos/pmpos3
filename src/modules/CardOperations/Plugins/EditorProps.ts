import { CardRecord } from '../../../models/Card';

export interface EditorProps<TData> {
    card: CardRecord;
    success: (actionType: string, data: any) => void;
    cancel: () => void;
    actionName: string;
    current: TData;
}
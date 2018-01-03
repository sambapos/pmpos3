import { Record } from 'immutable';

export interface Action {
    id: string;
    cardId: string;
    actionType: string;
    data: any;
    concurrencyData: any;
}

export class ActionRecord extends Record<Action>({
    id: '',
    cardId: '',
    actionType: '',
    data: {},
    concurrencyData: undefined
}) { }

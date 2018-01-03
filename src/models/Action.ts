import { Record } from 'immutable';

export interface Action {
    id: string;
    actionType: string;
    data: any;
    concurrencyData: any;
}

export class ActionRecord extends Record<Action>({
    id: '',
    actionType: '',
    data: {},
    concurrencyData: {}
}) { }

import { Record } from 'immutable';

export interface Action {
    actionType: string;
    data: any;
}

export class ActionRecord extends Record<Action>({
    actionType: '',
    data: {}
}) { }

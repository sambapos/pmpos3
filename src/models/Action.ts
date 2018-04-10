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
}) {
    relatesToCard(cardId: string): boolean {
        if (this.actionType === 'CREATE_CARD') {
            return this.data.id === cardId;
        }
        return this.cardId === cardId;
    }
}

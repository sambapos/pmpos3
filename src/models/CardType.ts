import { Record } from 'immutable';

export interface CardType {
    id: string;
    name: string;
    reference: string;
}

export class CardTypeRecord extends Record<CardType>({
    id: '',
    name: '',
    reference: ''
}) { }
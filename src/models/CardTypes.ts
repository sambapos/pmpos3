import { Record } from 'immutable';

export interface CardType {
    id: string;
    name: string;
}

export class CardTypeRecord extends Record<CardType>({
    id: '',
    name: ''
}) { }
import { Record } from 'immutable';

export interface CardType {
    id: string;
    name: string;
    reference: string;
    displayFormat: string;
    commands: string[];
    tagTypes: string[];
}

export class CardTypeRecord extends Record<CardType>({
    id: '',
    name: '',
    reference: '',
    displayFormat: '',
    commands: [],
    tagTypes: []
}) { }
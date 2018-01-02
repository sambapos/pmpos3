import { List, Record } from 'immutable';
import { ActionRecord } from '../../models/Action';
import { CardRecord } from '../../models/Card';

export interface Commit {
    id: string;
    cardId: string;
    time: number;
    state: CardRecord;
    actions: List<ActionRecord>;
}

export class CommitRecord extends Record<Commit>({
    id: '',
    cardId: '',
    time: new Date().getTime(),
    state: new CardRecord(),
    actions: List<ActionRecord>()
}) { }

export interface CardData {
    card: CardRecord;
    commits: List<CommitRecord>;
}

export class CardDataRecord extends Record<CardData>({
    card: new CardRecord(),
    commits: List<CommitRecord>()
}) { }

export interface State {
    cards: List<CardRecord>;
    currentCard: CardRecord;
    pendingActions: List<ActionRecord>;
    isLoaded: boolean;
    protocol: any;
}

export class StateRecord extends Record<State>({
    currentCard: new CardRecord(),
    pendingActions: List<ActionRecord>(),
    cards: List<CardRecord>(),
    isLoaded: false,
    protocol: undefined
}) { }
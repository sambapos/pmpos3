import { Map as IMap, List, Record } from 'immutable';

export interface Card {
    id: string;
    time: number;
    tags: IMap<string, string>;
}

export class CardRecord extends Record<Card>({
    id: '', time: 0, tags: IMap<string, string>()
}) { }

export interface Action {
    actionType: string;
    data: any;
}

export class ActionRecord extends Record<Action>({
    actionType: '',
    data: {}
}) { }

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
import { TypedRecord } from 'typed-immutable-record';
import { Map as IMap, List } from 'immutable';

export interface Card {
    id: string;
    time: number;
    tags: IMap<string, string>;
}

export interface CardRecord extends TypedRecord<CardRecord>, Card { }

export interface Action {
    actionType: string;
    data: any;
}

export interface ActionRecord extends TypedRecord<ActionRecord>, Action { }

export interface Commit {
    state: CardRecord;
    actions: List<ActionRecord>;
}

export interface CommitRecord extends TypedRecord<CommitRecord>, Commit { }

export interface CardData {
    card: CardRecord;
    commits: List<CommitRecord>;
}

export interface CardDataRecord extends TypedRecord<CardDataRecord>, CardData { }

export interface State {
    cardDataMap: IMap<string, CardDataRecord>;
    currentCard: CardRecord;
    pendingActions: List<ActionRecord>;
    isLoaded: boolean;
}

export interface StateRecord extends TypedRecord<StateRecord>, State { }
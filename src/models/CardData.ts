import { CardRecord } from './Card';
import { CommitRecord } from './Commit';
import { List, Record } from 'immutable';

export interface CardData {
    card: CardRecord;
    commits: List<CommitRecord>;
}

export class CardDataRecord extends Record<CardData>({
    card: new CardRecord(),
    commits: List<CommitRecord>()
}) { }
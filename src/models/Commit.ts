import { CardRecord } from './Card';
import { List, Record } from 'immutable';
import { ActionRecord } from './Action';

export interface Commit {
    id: string;
    cardId: string;
    time: number;
    state: CardRecord;
    terminalId: string;
    user: string;
    actions: List<ActionRecord>;
}

export class CommitRecord extends Record<Commit>({
    id: '',
    cardId: '',
    time: new Date().getTime(),
    state: new CardRecord(),
    terminalId: '',
    user: '',
    actions: List<ActionRecord>()
}) { }
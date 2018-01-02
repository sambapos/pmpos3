import { Map as IMap, Record } from 'immutable';

export interface Card {
    id: string;
    time: number;
    tags: IMap<string, string>;
}

export class CardRecord extends Record<Card>({
    id: '', time: 0, tags: IMap<string, string>()
}) { }

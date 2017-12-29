import { TypedRecord, makeTypedFactory } from 'typed-immutable-record';
import Card from 'material-ui/Card/Card';
import { Map as IMap } from 'immutable';

export interface Card {
    id: string;
    time: number;
    tags: IMap<string, string>;
}

export interface CardRecord extends TypedRecord<CardRecord>, Card { }

export const makeCard = makeTypedFactory<Card, CardRecord>({
    id: '',
    time: 0,
    tags: IMap<string, string>()
});
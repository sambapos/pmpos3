import { Record, Map as IMap, List } from 'immutable';
import { CardTagRecord } from './CardTag';

export interface Card {
    id: string;
    time: number;
    typeId: string;
    isClosed: boolean;
    tags: IMap<string, CardTagRecord>;
    cards: IMap<string, CardRecord>;
    keys: List<string>;
}

export class CardRecord extends Record<Card>({
    id: '',
    time: 0,
    typeId: '',
    isClosed: false,
    tags: IMap<string, CardTagRecord>(),
    cards: IMap<string, CardRecord>(),
    keys: List<string>()
}) {
    get balance(): number {
        let tagBalance = this.tags.reduce((x, y) => x + y.balance, 0);
        return tagBalance + this.subCardBalance;
    }

    get balanceDisplay(): string {
        if (this.balance !== 0) { return this.balance.toFixed(2); }
        return '';
    }

    get subCardBalance(): number {
        return this.cards.reduce((x, y) => x + y.balance, 0);
    }

    get display(): string {
        return this.name || this.id;
    }

    get name(): string {
        return this.tags.getIn(['Name', 'value']) || '';
    }

    get isNew(): boolean {
        return this.tags.count() === 0 && this.cards.count() === 0;
    }

    getTags(): List<CardTagRecord> {
        return List<CardTagRecord>(this.tags.valueSeq());
    }
}

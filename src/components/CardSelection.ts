import { CardRecord } from "pmpos-core";
import { Map as IMap } from 'immutable';

export interface ISelectedCard {
    card: CardRecord;
}

export class CardSelection {
    public items: IMap<string, CardRecord>;

    constructor() {
        this.items = IMap<string, CardRecord>();
    }

    public get cardTypes(): string[] {
        return this.items.keySeq().toArray();
    }

    public set(cardTypeName: string, card: CardRecord) {
        this.items = this.items.set(cardTypeName, card);
    }

    public get(cardTypeName: string): CardRecord | undefined {
        return this.items.get(cardTypeName);
    }

    public getCardName(): string {
        return this.items.reduce((r, s) => {
            if (r !== '') { r = r + '.'; }
            return r + s.name;
        }, '');
    }

}

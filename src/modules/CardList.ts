import { List, Map as IMap } from 'immutable';
import { CommitRecord, Commit } from '../models/Commit';
import { CardRecord } from '../models/Card';
import { cardOperations } from './CardOperations/index';
import { ActionRecord } from '../models/Action';
import { makeDeepCommit } from '../models/makers';
import { Suggestion } from './CardOperations/Plugins/SetCardTag/AutoSuggest';
import { CardTypeRecord } from '../models/CardType';
import CardTagData from '../models/CardTagData';

class CardList {
    commits: IMap<string, List<CommitRecord>>;
    cards: IMap<string, CardRecord>;
    cardTypes: IMap<string, CardTypeRecord>;
    cardTypeIndex: IMap<string, List<string>>;

    constructor() {
        this.commits = IMap<string, List<CommitRecord>>();
        this.cards = IMap<string, CardRecord>();
        this.cardTypes = IMap<string, CardTypeRecord>();
    }

    setCardTypes(cardTypes: IMap<string, CardTypeRecord>) {
        this.cardTypes = cardTypes;
    }

    readConcurrencyData(actionType: string, card: CardRecord, actionData: any): any {
        return cardOperations.getConcurrencyData(actionType, card, actionData);
    }

    applyAction(card: CardRecord = new CardRecord(), action: ActionRecord, executeRules: boolean = false): CardRecord {
        if (cardOperations.canHandle(action)) {
            return cardOperations.reduce(card, action);
        }
        return card;
    }

    canApplyAction(card: CardRecord, action: ActionRecord): boolean {
        return cardOperations.canApplyAction(card, action);
    }

    actionReduce = (card: CardRecord, action: ActionRecord) => {
        return this.applyAction(card, action);
    }

    commitReduce = (card: CardRecord, commit: CommitRecord) => {
        return commit.actions.reduce(this.actionReduce, card);
    }

    getCardTypeIndex() {
        return this.cards.reduce(
            (r: IMap<string, List<string>>, card) => {
                return r.update(card.typeId, list => {
                    if (!list) {
                        list = List<string>();
                    }
                    return list.push(card.id);
                });
            },
            IMap<string, List<string>>());
    }

    reIndexCardType() {
        this.cardTypeIndex = this.getCardTypeIndex();
    }

    addCommits(commits: Commit[]) {
        commits.forEach(x => this.addCommit(x));
        this.reIndexCardType();
    }

    getCards(): IMap<string, CardRecord> {
        return this.cards;
    }

    getCardTypes(): IMap<string, CardTypeRecord> {
        return this.cardTypes;
    }

    reduceTags(card: CardRecord, list: List<CardTagData>, filters: string[]) {
        let foundTags = card.getTags(filters);
        list = list.merge(foundTags.result
            .map(ft => { return new CardTagData(foundTags.filter, ft, card); }));
        return card.cards.reduce((r, c) => this.reduceTags(c, r, filters), list);
    }

    getTags(filters: string[]): List<CardTagData> {
        return this.getTagsFrom(filters, this.cards);
    }

    getTagsFrom(filters: string[], cards: IMap<string, CardRecord>): List<CardTagData> {
        return cards.reduce((r, card) => this.reduceTags(card, r, filters), List<CardTagData>());
    }

    getCardsByType(typeId: string): List<CardRecord> {
        if (typeId && this.cardTypeIndex) {
            let index = this.cardTypeIndex.get(typeId);
            if (index) {
                return index
                    .map(id => this.cards.get(id) as CardRecord)
                    .sort((a, b) => a.time - b.time)
                    || List<CardRecord>();
            }
        }
        return List<CardRecord>();
    }

    getCardTypeIdByRef(ref: string): string {
        let ct = this.getCardTypeByRef(ref);
        if (ct) { return ct.id; }
        return '';
    }

    getCardTypeByRef(ref: string): CardTypeRecord | undefined {
        let ct = this.cardTypes.find(x => x.reference === ref || x.name === ref);
        return ct;
    }

    getCardType(id: string): CardTypeRecord | undefined {
        return this.cardTypes.get(id);
    }

    getCard(id: string): CardRecord {
        return this.cards.get(id) as CardRecord;
    }

    getCardByName(type: string, name: string): CardRecord | undefined {
        let ctId = this.getCardTypeIdByRef(type);
        return this.getCardsByType(ctId).find(c => c.hasTag('Name', name)) as CardRecord;
    }

    getCommits(id: string): List<CommitRecord> | undefined {
        return this.commits.get(id);
    }

    getCardSuggestions(ref: string, value: string): Suggestion[] {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        if (inputLength === 0) { return []; }

        let cardType = this.cardTypes
            .find(x => x.reference === ref) || new CardTypeRecord();

        let result = [] as Suggestion[];
        if (cardType.name) {
            let index = this.cardTypeIndex.get(cardType.id) || List<string>();
            let cards = index.map(id => this.cards.get(id) as CardRecord);
            result = cards
                .filter(c => c.name.toLowerCase().trim().includes(inputValue))
                .map(c => {
                    return { label: c.name };
                })
                .toArray();
        }
        return result;
    }

    private addCommit(commit: Commit) {
        this.commits = this.commits.update(commit.cardId, list => {
            if (!list) { list = List<CommitRecord>(); }
            return list.push(makeDeepCommit(commit));
        });
        this.cards = this.cards.update(commit.cardId, cardRecord => {
            let commits = this.commits.get(commit.cardId) as List<CommitRecord>;
            return commits
                .sort((a, b) => a.time - b.time)
                .reduce(this.commitReduce, new CardRecord());
        });
    }
}

export default new CardList();
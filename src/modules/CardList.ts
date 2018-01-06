import { List, Map as IMap } from 'immutable';
import { CommitRecord, Commit } from '../models/Commit';
import { CardRecord } from '../models/Card';
import { cardOperations } from './CardOperations/index';
import { ActionRecord } from '../models/Action';
import { makeDeepCommit } from '../models/makers';
import { Suggestion } from './CardOperations/Plugins/SetCardTag/AutoSuggest';

class CardList {

    commits: IMap<string, List<CommitRecord>>;
    cards: IMap<string, CardRecord>;
    cardIndex: IMap<string, List<string>>;

    constructor() {
        this.commits = IMap<string, List<CommitRecord>>();
        this.cards = IMap<string, CardRecord>();
    }

    readConcurrencyData(actionType: string, card: CardRecord, actionData: any): any {
        return cardOperations.getConcurrencyData(actionType, card, actionData);
    }

    applyAction(card: CardRecord = new CardRecord(), action: ActionRecord): CardRecord {
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

    addCommit(commit: Commit) {
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

    addCommits(commits: Commit[]) {
        commits.forEach(x => this.addCommit(x));
    }

    getCards(): IMap<string, CardRecord> {
        return this.cards;
    }

    getCard(id: string): CardRecord {
        return this.cards.get(id) as CardRecord;
    }

    getCommits(id: string): List<CommitRecord> | undefined {
        return this.commits.get(id);
    }

    getCardSuggestions(ref: string, value1: string): Suggestion[] {
        const inputValue = value1.trim().toLowerCase();
        const inputLength = inputValue.length;
        if (inputLength === 0) { return []; }
        let card = this.cards.find(c => {
            let refTag = c.tags.get('Ref');
            if (refTag) { return refTag.value === ref; }
            return false;
        });
        let result = [] as Suggestion[];
        if (card) {
            result = card.cards.valueSeq()
                .filter(c => {
                    if (!c.tags.has('Name')) { return false; }
                    let val: string = c.tags.getIn(['Name', 'value']);
                    return val.trim().toLowerCase().indexOf(inputValue) > -1;
                })
                .map(c => {
                    return { label: c.tags.getIn(['Name', 'value']) };
                })
                .toArray();
        }
        return result;
    }
}

export default new CardList();
import { CommitRecord, Commit } from './models';
import { List, Map as IMap } from 'immutable';
import { cardOperations } from '../../modules/CardOperations';
import { ActionRecord } from '../../models/Action';
import { CardRecord } from '../../models/Card';
import { makeDeepCommit } from './makers';

export default class CardList {

    commits: IMap<string, List<CommitRecord>>;
    cards: IMap<string, CardRecord>;

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

    getCards(): List<CardRecord> {
        return List<CardRecord>(this.cards.valueSeq());
    }

    getCard(id: string): CardRecord {
        return this.cards.get(id) as CardRecord;
    }

    getCommits(id: string): List<CommitRecord> | undefined {
        return this.commits.get(id);
    }
}

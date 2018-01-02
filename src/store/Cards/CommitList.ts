import { CommitRecord, Commit } from './models';
import { List, Map as IMap } from 'immutable';
import { cardOperations } from '../../modules/CardOperations';
import { ActionRecord } from '../../models/Action';
import { CardRecord } from '../../models/Card';

export default class CommitList {
    commits: IMap<string, List<CommitRecord>>;
    cards: IMap<string, CardRecord>;

    constructor() {
        this.commits = IMap<string, List<CommitRecord>>();
        this.cards = IMap<string, CardRecord>();
    }

    applyAction(card: CardRecord | undefined, action: ActionRecord): CardRecord {
        return cardReducer(card, action);
    }

    addCommit(commit: Commit) {
        this.commits = this.commits.update(commit.cardId, list => {
            if (!list) { list = List<CommitRecord>(); }
            return list.push(new CommitRecord(commit));
        });
        this.cards = this.cards.update(commit.cardId, cardRecord => {
            let commits = this.commits.get(commit.cardId) as List<CommitRecord>;
            let actions = commits.sort((a, b) => a.time - b.time).flatMap((x: CommitRecord) => x.actions);
            return actions.reduce(
                (c: CardRecord, action: ActionRecord) => cardReducer(c, action),
                new CardRecord());
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
}

const cardReducer = (
    card: CardRecord = new CardRecord(),
    action: ActionRecord
) => {
    if (cardOperations.canHandle(action)) {
        return cardOperations.reduce(card, action);
    }
    return card;
};

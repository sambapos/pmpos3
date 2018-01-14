import { Map as IMap, List } from 'immutable';
import { CardData, CardDataRecord } from './CardData';
import { CommitRecord, Commit } from './Commit';
import { ActionRecord } from './Action';
import { Card, CardRecord } from './Card';
import { CardTagRecord } from './CardTag';

export const makeDeepCard = (card: Card): CardRecord => {
    return new CardRecord({
        id: card.id,
        time: card.time,
        typeId: card.typeId,
        tags: IMap<string, CardTagRecord>(card.tags),
        cards: IMap<string, CardRecord>(card.cards)
    });
};

export const makeDeepCommit = (commit: Commit): CommitRecord => {
    return new CommitRecord({
        id: commit.id,
        time: commit.time,
        cardId: commit.cardId,
        terminalId: commit.terminalId,
        user: commit.user,
        actions: List<ActionRecord>(commit.actions.map(action => new ActionRecord(action)))
    });
};

export const makeDeepCardData = (cardData: CardData): CardDataRecord => {
    return new CardDataRecord({
        card: makeDeepCard(cardData.card),
        commits: List<CommitRecord>(cardData.commits.map(
            commit => makeDeepCommit(commit as Commit))
        )
    });
};
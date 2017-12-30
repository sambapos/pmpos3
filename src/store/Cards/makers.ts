import { makeTypedFactory } from 'typed-immutable-record';
import {
    Action, ActionRecord, Commit, CommitRecord, Card,
    CardRecord, CardData, CardDataRecord, State, StateRecord
} from './models';
import { Map as IMap, List } from 'immutable';

export const makeCard = makeTypedFactory<Card, CardRecord>({
    id: '',
    time: 0,
    tags: IMap<string, string>()
});

export const makeAction = makeTypedFactory<Action, ActionRecord>({
    actionType: '',
    data: {}
});

export const makeCommit = makeTypedFactory<Commit, CommitRecord>({
    state: makeCard(),
    actions: List<ActionRecord>()
});

export const makeCardData = makeTypedFactory<CardData, CardDataRecord>({
    card: makeCard(),
    commits: List<CommitRecord>()
});

export const makeState = makeTypedFactory<State, StateRecord>({
    cardDataMap: IMap<string, CardDataRecord>(),
    currentCard: makeCard(),
    pendingActions: List<ActionRecord>(),
    isLoaded: false
});

export const makeDeepCardData = (cardData: CardData): CardDataRecord => {
    return makeCardData({
        card: makeDeepCard(cardData.card),
        commits: List<CommitRecord>(cardData.commits.map(
            commit => makeDeepCommit(commit as Commit))
        )
    });
};

export const makeDeepCommit = (commit: Commit): CommitRecord => {
    return makeCommit({
        state: makeDeepCard(commit.state),
        actions: List<ActionRecord>(commit.actions.map(action => makeAction(action)))
    });
};

export const makeDeepCard = (card: Card): CardRecord => {
    return makeCard({
        id: card.id,
        time: card.time,
        tags: IMap<string, string>(card.tags)
    });
};
import { List } from 'immutable';
import * as faker from 'faker';
import * as shortid from 'shortid';
import { CardRecord, CardTypeRecord, ActionRecord } from 'pmpos-models';

export const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : ''
});

export const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    background: isDragging ? 'white' : '',
    // styles we need to apply on draggables
    ...draggableStyle,
});

export function getFilteredItems(items: List<CardRecord>, searchValue: string, showClosedCards: boolean) {
    return items.filter(x =>
        searchValue
        || showClosedCards
        || !x.isClosed)
        .filter(x => !searchValue
            || Boolean(x.tags.find(t => t.value.toLowerCase().includes(searchValue.toLowerCase()))));
}

export function getItems(cards: List<CardRecord>, startIndex: number, itemCount: number) {
    let result = cards
        .skip(startIndex)
        .take(itemCount)
        .sort((x, y) => x.index - y.index)
        .toArray();
    return result;
}

function getCardCreateAction(cardId: string, cardType: CardTypeRecord) {
    return new ActionRecord({
        actionType: 'CREATE_CARD',
        id: shortid.generate(),
        data: {
            id: cardId,
            typeId: cardType.id,
            type: cardType.name,
            time: new Date().getTime()
        }
    });
}

function getTagCardAction(cardId: string, data: any) {
    return new ActionRecord({
        actionType: 'SET_CARD_TAG',
        id: shortid.generate(),
        cardId,
        data
    });
}

function getCardCommit(props: any) {
    let cardId = shortid.generate();
    let actions = List<ActionRecord>();
    actions = actions.push(getCardCreateAction(cardId, props.currentCardType));
    actions = actions.push(getTagCardAction(cardId, {
        name: 'Name', value: faker.name.findName()
    }));
    actions = actions.push(getTagCardAction(cardId, {
        name: 'Address', value: faker.address.streetAddress()
    }));
    actions = actions.push(getTagCardAction(cardId, {
        name: 'Phone', value: faker.phone.phoneNumber()
    }));
    let commit = {
        id: shortid.generate(),
        time: new Date().getTime(),
        cardId: cardId,
        actions: actions.toJS(),
    };
    return commit;
}

export function createTestCards(props: any) {
    let commits: any[] = [];
    for (let index = 0; index < 500; index++) {
        let commit = getCardCommit(props);
        commits.push(commit);
        // props.addCard(props.currentCardType);
        // props.addPendingAction(undefined, 'SET_CARD_TAG', {
        //     name: 'Name', value: faker.name.findName()
        // });
        // props.addPendingAction(undefined, 'SET_CARD_TAG', {
        //     name: 'Address', value: faker.address.streetAddress()
        // });
        // props.addPendingAction(undefined, 'SET_CARD_TAG', {
        //     name: 'Phone', value: faker.phone.phoneNumber()
        // });
        // props.commitCard();
    }
    props.postCommits(commits);
}
import * as React from 'react';
import { CardRecord } from '../../models/Card';
import { List } from 'immutable';
import * as faker from 'faker';

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

export function getItems(
    cards: List<CardRecord>,
    startIndex: number,
    itemCount: number) {
    let result = cards
        .skip(startIndex)
        .take(itemCount)
        .sort((x, y) => x.index - y.index)
        .map(card => {
            return {
                text: card.display,
                id: card.id,
                secondary: card.tags.valueSeq()
                    .filter(tag => tag.name !== 'Name')
                    .map(tag => (
                        <span
                            style={{ marginRight: '8px' }}
                            key={tag.name}
                        >
                            {tag.display}
                        </span>)),
                action: card.balanceDisplay
            };
        })
        .toArray();
    return result;
}

export function createTestCards(props: any) {
    for (let index = 0; index < 500; index++) {
        props.addCard(props.currentCardType);
        props.addPendingAction(undefined, 'SET_CARD_TAG', {
            name: 'Name', value: faker.name.findName()
        });
        props.addPendingAction(undefined, 'SET_CARD_TAG', {
            name: 'Address', value: faker.address.streetAddress()
        });
        props.addPendingAction(undefined, 'SET_CARD_TAG', {
            name: 'Phone', value: faker.phone.phoneNumber()
        });
        props.commitCard();
    }
}

export function getSecondaryCommands({ props, setState, state }: any) {
    let result = [
        {
            icon: 'arrow_drop_down',
            menuItems: props.cardTypes.valueSeq().map(ct => {
                return {
                    icon: ct.name, onClick: () => {
                        let item = props.cardTypes.valueSeq().find(c => c.name === ct.name);
                        if (item) { setState({ currentCardType: item }); }
                        props.setCurrentCardType(item);
                    }
                };
            }).toArray()
        },
        {
            icon: 'developer_mode',
            menuItems: [
                {
                    icon: 'Show Hidden Cards',
                    onClick: () => {
                        setState({ showClosedCards: !state.showClosedCards });
                    }
                },
                {
                    icon: 'Create Test Cards',
                    onClick: () => {
                        createTestCards(props);
                    }
                },
                {
                    icon: 'Delete Cards',
                    onClick: () => {
                        props.deleteCards(props.currentCardType.id);
                    }
                }
            ]
        },
        {
            icon: 'add',
            onClick: () => {
                if (props.currentCardType.id) {
                    props.addCard(props.currentCardType);
                    props.history.push(process.env.PUBLIC_URL + '/card');
                }
            }
        }
    ];
    return result;
}
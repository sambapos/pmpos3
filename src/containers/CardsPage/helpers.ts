import { List } from 'immutable';
import { CardRecord } from 'pmpos-models';

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
    return cards
        .skip(startIndex)
        .take(itemCount)
        .sort((x, y) => x.index - y.index)
        .toArray();
}
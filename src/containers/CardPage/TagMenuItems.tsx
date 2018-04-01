import * as React from 'react';
import CardList from '../../modules/CardList';
import { CardPageProps } from './CardPageProps';
import { CardRecord } from '../../models/Card';
import { MenuItem, Divider } from 'material-ui';
import CardOperation from '../../modules/CardOperations/CardOperation';
import { cardOperations } from '../../modules/CardOperations';

interface TagMenuItemsProps {
    selectedCard: CardRecord;
    handleOperation: (operation?: CardOperation, currentData?: any) => void;
    handleMenuClose: () => void;
}

export default (props: CardPageProps & TagMenuItemsProps) => {

    let cardTags = props.selectedCard.tags.valueSeq();
    let unselectedTagTypes = CardList.tagTypes.valueSeq()
        .filter(x => !cardTags.find(y => y.typeId === x.id));

    return (<>
        {unselectedTagTypes.map(tagType => {
            return (<MenuItem
                key={'set_' + tagType.name}
                onClick={() => {
                    props.handleOperation(
                        cardOperations.get('SET_CARD_TAG'),
                        { tagType }
                    );
                    props.handleMenuClose();
                }}
            >
                Select {tagType.cardTypeReferenceName}
            </MenuItem>);
        })}
        {cardTags.map(tag => {
            return (
                <MenuItem
                    key={'edit_' + tag.name}
                    onClick={() => {
                        props.handleOperation(
                            cardOperations.get('SET_CARD_TAG'),
                            { tagType: CardList.tagTypes.find(x => x.id === tag.typeId), tag }
                        );
                        props.handleMenuClose();
                    }}
                >Change {!tag.name.startsWith('_') ? tag.name : tag.value}
                </MenuItem>
            );
        })}
        {(cardTags.count() > 0 || unselectedTagTypes.count() > 0) && <Divider />}
        {cardOperations.getOperations().map(option => (
            <MenuItem
                key={'cmd_' + option.type}
                onClick={e => {
                    props.handleOperation(option, { card: props.selectedCard });
                    props.handleMenuClose();
                }}
            >
                {option.description}
            </MenuItem>
        ))}
    </>);
};
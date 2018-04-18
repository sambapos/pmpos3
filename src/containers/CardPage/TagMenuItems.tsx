import * as React from 'react';
import { CardPageProps } from './CardPageProps';
import { MenuItem, Divider } from 'material-ui';
import { CardRecord, TagTypeRecord, CardTypeRecord } from 'pmpos-models';
import { CardList, CardOperation, cardOperations } from 'pmpos-modules';

interface TagMenuItemsProps {
    selectedCard: CardRecord;
    handleOperation: (operation?: CardOperation, currentData?: any) => void;
    handleMenuClose: () => void;
}

export default (props: CardPageProps & TagMenuItemsProps) => {

    let cardTags = props.selectedCard.tags.valueSeq();
    let cardType = CardList.getCardType(props.selectedCard.typeId);
    let unselectedTagTypes: TagTypeRecord[] = [];
    let subCardTypes: CardTypeRecord[] = [];

    if (cardType) {
        unselectedTagTypes = cardType.tagTypes
            .filter(x => !cardTags.find(y => y.typeId === x))
            .map(x => CardList.tagTypes.get(x) as TagTypeRecord);
        subCardTypes = cardType.subCardTypes.map(x => CardList.cardTypes.get(x) as CardTypeRecord);
    }

    return (<>
        {subCardTypes.map(ct => {
            return <MenuItem
                key={'ct_' + ct.id}
                onClick={() => {
                    props.handleOperation(
                        cardOperations.get('CREATE_CARD'),
                        { typeId: ct.id }
                    );
                    props.handleMenuClose();
                }}>
                Add {ct.reference}
            </MenuItem>;
        })}
        {subCardTypes.length > 0 && <Divider />}
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
                Set {tagType.tagName}
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
                >Edit {!tag.name.startsWith('_') ? tag.name : tag.value}
                </MenuItem>
            );
        })}
        {(cardTags.count() > 0 || unselectedTagTypes.length > 0) && <Divider />}
        {cardOperations.getOperations().map(op => (
            <MenuItem
                key={'cmd_' + op.type}
                onClick={e => {
                    props.handleOperation(op);
                    props.handleMenuClose();
                }}
            >
                {op.description}
            </MenuItem>
        ))}
    </>);
};
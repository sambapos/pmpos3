import * as React from 'react';
import { CardPageProps } from './CardPageProps';
import { MenuItem, Divider } from '@material-ui/core';
import { CardRecord, TagTypeRecord, CardTypeRecord, ConfigManager, CardOperation, cardOperations } from 'sambadna-core';

interface ITagMenuItemsProps {
    selectedCard: CardRecord;
    handleOperation: (operation?: CardOperation, currentData?: any) => void;
    handleMenuClose: () => void;
}

export default (props: CardPageProps & ITagMenuItemsProps) => {

    const cardTags = props.selectedCard.tags.valueSeq();
    const cardType = ConfigManager.getCardTypeById(props.selectedCard.typeId);
    let unselectedTagTypes: TagTypeRecord[] = [];
    let subCardTypes: CardTypeRecord[] = [];

    if (cardType) {
        unselectedTagTypes = cardType.tagTypes
            .filter(tagTypeId => !cardTags.find(y => y.typeId === tagTypeId))
            .map(tagTypeId => ConfigManager.getTagTypeById(tagTypeId) as TagTypeRecord);
        subCardTypes = cardType.subCardTypes.map(cardTypeId => ConfigManager.getCardTypeById(cardTypeId) as CardTypeRecord);
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
                            { tagType: ConfigManager.findTagType(tagType => tagType.id === tag.typeId), tag }
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
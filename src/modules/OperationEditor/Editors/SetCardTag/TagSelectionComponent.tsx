import * as React from 'react';
import { DialogTitle, DialogActions, Button } from '@material-ui/core';
import CardSelectorPage from '../../../../containers/CardSelectorPage';
import { TagTypeRecord, CardTagRecord } from 'pmpos-core';
import IEditorProperties from '../editorProperties';

export default (props: IEditorProperties<{ tagType: TagTypeRecord, tag: CardTagRecord }>) => {
    const tagType = props.current ? props.current.tagType : new TagTypeRecord();
    const tag = props.current ? props.current.tag : new CardTagRecord();
    return <>
        <DialogTitle>{
            tag.value
                ? `Change ${tagType.tagName || tagType.cardTypeReferenceName}: ${tag.value}`
                : `Set ${tagType.tagName || tagType.cardTypeReferenceName}`
        }
        </DialogTitle>
        <div style={{ margin: 4, overflow: 'auto', flex: 1 }}>
            <CardSelectorPage
                cardType={tagType.cardTypeReferenceName}
                onSelectCards={selectedCards => {
                    const cardName = selectedCards.getCardName();
                    const card = selectedCards.get(tagType.cardTypeReferenceName);
                    if (card) {
                        const data = {
                            ...tag.toJS(),
                            name: tagType.tagName, value: cardName, typeId: tagType.id, cardId: card.id
                        };
                        props.success(props.actionName, data);
                    }
                }}
            />
        </div>
        <DialogActions>
            <Button onClick={() => props.cancel()}>Cancel</Button>
        </DialogActions>
    </>;
};

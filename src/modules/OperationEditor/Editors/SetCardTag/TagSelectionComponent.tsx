import * as React from 'react';
import { DialogTitle, DialogActions, Button } from 'material-ui';
import CardSelectorPage from '../../../../containers/CardSelectorPage';
import { TagTypeRecord, CardTagRecord } from 'pmpos-models';
import EditorProperties from '../editorProperties';

export default (props: EditorProperties<{ tagType: TagTypeRecord, tag: CardTagRecord }>) => {
    let tagType = props.current ? props.current.tagType : new TagTypeRecord();
    let tag = props.current ? props.current.tag : new CardTagRecord();
    return <>
        <DialogTitle>{
            tag.value
                ? `Change ${tagType.tagName || tagType.cardTypeReferenceName}: ${tag.value}`
                : `Set ${tagType.tagName || tagType.cardTypeReferenceName}`
        }
        </DialogTitle>
        <div style={{ margin: 4 }}>
            <CardSelectorPage
                cardType={tagType.cardTypeReferenceName}
                onSelectCard={card => {
                    let data = {
                        ...tag.toJS(),
                        name: tagType.tagName, value: card.name, type: tagType.name
                    };
                    props.success(props.actionName, data);
                }}
            />
        </div>
        <DialogActions>
            <Button onClick={() => props.cancel()}>Cancel</Button>
        </DialogActions>
    </>;
};

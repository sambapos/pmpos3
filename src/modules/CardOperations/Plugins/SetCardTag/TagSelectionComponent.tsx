import * as React from 'react';
import { DialogTitle, DialogActions, Button } from 'material-ui';
import CardSelectorPage from '../../../../containers/CardSelectorPage';
import { TagEditorProps } from './TagEditorProps';

export default (props: TagEditorProps) => {
    let tagType = props.current.tagType;
    return <>
        <DialogTitle>{
            props.current.tag.value
                ? `Change ${tagType.tagName || tagType.cardTypeReferenceName}: ${props.current.tag.value}`
                : `Set ${tagType.tagName || tagType.cardTypeReferenceName}`
        }
        </DialogTitle>
        <div style={{ margin: 4 }}>
            <CardSelectorPage
                cardType={tagType.cardTypeReferenceName}
                onSelectCard={card => {
                    let data = {
                        ...props.current.tag.toJS(),
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

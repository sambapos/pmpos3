import * as React from 'react';
import { DialogTitle } from 'material-ui';
import { CardTagRecord } from '../../../../models/CardTag';
import { TagTypeRecord } from '../../../../models/TagType';
import { CardRecord } from '../../../../models/Card';
import TagEditor from './TagEditor';
import CardSelectorComponent from './CardSelectorComponent';

interface Props {
    card: CardRecord;
    success: (actionType: string, data: any) => void;
    cancel: () => void;
    actionName: string;
    current: { tagType: TagTypeRecord, tag: CardTagRecord };
}

const TagEditorComponent = (props: Props) => {
    return <>
        <DialogTitle>{
            `Set ${props.current.tagType.id
                ? props.current.tagType.tagName || props.current.tagType.cardTypeReferenceName
                : ' Card Tag'}`
        }
        </DialogTitle>
        <TagEditor
            tag={props.current.tag}
            tagType={props.current.tagType}
            onSubmit={data => props.success(props.actionName, data)}
        />
    </>;
};

export default (props: Props) => {
    let tagType = props.current.tagType;
    if (tagType.isTagSelection()) {
        return <CardSelectorComponent
            cardType={tagType.cardTypeReferenceName}
            onSelectCard={card => {
                let data = {
                    ...props.current.tag.toJS(),
                    name: tagType.tagName, value: card.name, type: tagType.name
                };
                props.success(props.actionName, data);
            }}
        />;
    }
    return <TagEditorComponent {...props} />;
};
import * as React from 'react';
import { DialogTitle } from 'material-ui';
import TagEditor from './TagEditor';
import { TagTypeRecord, CardTagRecord } from 'pmpos-models';
import EditorProperties from '../editorProperties';

export default (props: EditorProperties<{ tagType: TagTypeRecord, tag: CardTagRecord }>) => {
    return <>
        <DialogTitle>{
            `Set ${props.current && props.current.tagType.id
                ? props.current.tagType.tagName || props.current.tagType.cardTypeReferenceName
                : ' Card Tag'}`
        }
        </DialogTitle>
        <TagEditor
            tag={props.current ? props.current.tag : new CardTagRecord()}
            tagType={props.current ? props.current.tagType : new TagTypeRecord()}
            onSubmit={data => props.success(props.actionName, data)}
        />
    </>;
};
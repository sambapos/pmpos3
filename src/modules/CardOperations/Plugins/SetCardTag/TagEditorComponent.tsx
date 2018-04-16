import * as React from 'react';
import { DialogTitle } from 'material-ui';
import TagEditor from './TagEditor';
import { TagEditorProps } from './TagEditorProps';

export default (props: TagEditorProps) => {
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
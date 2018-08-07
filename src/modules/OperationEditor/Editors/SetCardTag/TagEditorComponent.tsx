import * as React from 'react';
import { DialogTitle } from '@material-ui/core';
import TagEditor from './TagEditor';
import { TagTypeRecord, CardTagRecord } from 'sambadna-core';
import IEditorProperties from '../editorProperties';

export default (props: IEditorProperties<{ tagType: TagTypeRecord, tag: CardTagRecord }>) => {
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
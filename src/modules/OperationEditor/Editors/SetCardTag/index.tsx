import * as React from 'react';
import TagEditorComponent from './TagEditorComponent';
import TagSelectionComponent from './TagSelectionComponent';
import { TagTypeRecord, CardTagRecord } from 'pmpos-core';
import IEditorProperties from '../editorProperties';

export default (props: IEditorProperties<{ tagType: TagTypeRecord, tag: CardTagRecord }>) => {
    const tagType = props.current ? new TagTypeRecord(props.current.tagType) : new TagTypeRecord();
    const tag = props.current ? new CardTagRecord(props.current.tag) : new CardTagRecord();
    const properties = { ...props, current: { tag, tagType } };
    if (tagType.isTagSelection()) {
        return <TagSelectionComponent {...properties} />;
    }
    return <TagEditorComponent {...properties} />;
};
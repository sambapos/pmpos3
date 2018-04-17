import * as React from 'react';
import TagEditorComponent from './TagEditorComponent';
import TagSelectionComponent from './TagSelectionComponent';
import { TagTypeRecord, CardTagRecord } from 'pmpos-models';
import EditorProperties from '../editorProperties';

export default (props: EditorProperties<{ tagType: TagTypeRecord, tag: CardTagRecord }>) => {
    let tagType = props.current ? new TagTypeRecord(props.current.tagType) : new TagTypeRecord();
    let tag = props.current ? new CardTagRecord(props.current.tag) : new CardTagRecord();
    let properties = { ...props, current: { tag, tagType } };
    if (tagType.isTagSelection()) {
        return <TagSelectionComponent {...properties} />;
    }
    return <TagEditorComponent {...properties} />;
};
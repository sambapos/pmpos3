import * as React from 'react';
import { TagEditorProps } from './TagEditorProps';
import TagEditorComponent from './TagEditorComponent';
import TagSelectionComponent from './TagSelectionComponent';

export default (props: TagEditorProps) => {
    let tagType = props.current.tagType;
    if (tagType.isTagSelection()) {
        return <TagSelectionComponent {...props} />;
    }
    return <TagEditorComponent {...props} />;
};
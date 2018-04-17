import * as React from 'react';
import TagEditorComponent from './TagEditorComponent';
import TagSelectionComponent from './TagSelectionComponent';
import { TagTypeRecord, CardTagRecord } from 'pmpos-models';
import EditorProperties from '../editorProperties';

export default (props: EditorProperties<{ tagType: TagTypeRecord, tag: CardTagRecord }>) => {
    if (props.current) {
        let tagType = props.current.tagType;
        if (tagType.isTagSelection()) {
            return <TagSelectionComponent {...props} />;
        }
    }
    return <TagEditorComponent {...props} />;
};
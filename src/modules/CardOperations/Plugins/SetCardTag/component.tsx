import * as React from 'react';
import { EditorProps } from '../EditorProps';
import TagEditorComponent from './TagEditorComponent';
import TagSelectionComponent from './TagSelectionComponent';
import { TagTypeRecord } from '../../../../models/TagType';
import { CardTagRecord } from '../../../../models/CardTag';

export default (props: EditorProps<{ tagType: TagTypeRecord, tag: CardTagRecord }>) => {
    let tagType = props.current.tagType;
    if (tagType.isTagSelection()) {
        return <TagSelectionComponent {...props} />;
    }
    return <TagEditorComponent {...props} />;
};
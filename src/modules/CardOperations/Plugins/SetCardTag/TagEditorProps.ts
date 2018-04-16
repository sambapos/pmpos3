import { CardRecord } from '../../../../models/Card';
import { TagTypeRecord } from '../../../../models/TagType';
import { CardTagRecord } from '../../../../models/CardTag';

export interface TagEditorProps {
    card: CardRecord;
    success: (actionType: string, data: any) => void;
    cancel: () => void;
    actionName: string;
    current: { tagType: TagTypeRecord, tag: CardTagRecord };
}
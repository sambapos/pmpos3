import { Record } from 'immutable';

export interface TagType {
    id: string;
    name: string;
    cardTypeId: string;
    cardTypeReferenceId: string;
}

export class TagTypeRecord extends Record<TagType>({
    id: '',
    name: '',
    cardTypeId: '',
    cardTypeReferenceId: ''
}) { }
import { Record } from 'immutable';

export interface TagType {
    id: string;
    name: string;
    cardTypeReferenceName: string;
    showValue: boolean;
    showQuantity: boolean;
    showUnit: boolean;
    showAmount: boolean;
    showSource: boolean;
    showTarget: boolean;
    showFunction: boolean;
    sourceCardTypeReferenceName: string;
    targetCardTypeReferenceName: string;
    displayFormat: string;
    icon: string;
    defaultFunction: string;
    defaultValue: string;
    defaultSource: string;
    defaultTarget: string;
    defaultQuantity: number;
    defaultUnit: string;
    defaultAmount: number;
}

export class TagTypeRecord extends Record<TagType>({
    id: '',
    name: '',
    cardTypeReferenceName: '',
    showValue: true,
    showQuantity: true,
    showUnit: true,
    showAmount: true,
    showSource: true,
    showTarget: true,
    showFunction: false,
    sourceCardTypeReferenceName: '',
    targetCardTypeReferenceName: '',
    displayFormat: '',
    icon: '',
    defaultFunction: '',
    defaultValue: '',
    defaultSource: '',
    defaultTarget: '',
    defaultQuantity: 0,
    defaultUnit: '',
    defaultAmount: 0
}) { }
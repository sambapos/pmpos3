import { Record } from 'immutable';

export interface TagType {
    id: string;
    name: string;
    tagName: string;
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
    tagName: '',
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
}) {
    isTagSelection(): boolean {
        if (!this.id || !this.cardTypeReferenceName || !this.showValue
            || this.showQuantity || this.showUnit || this.showAmount
            || this.showSource || this.showTarget || this.showFunction) {
            return false;
        }
        return true;
    }
}
import { Record } from 'immutable';

export interface Rule {
    id: string;
    name: string;
    content: string;
}

export class RuleRecord extends Record<Rule>({
    id: '',
    name: '',
    content: ''
}) { }
import { ActionRecord } from './Action';
import { CardRecord } from './Card';

export interface ActionState {
    action: ActionRecord;
    card: CardRecord;
    root: CardRecord;
}
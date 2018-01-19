import { ActionRecord } from "./Action";
import { CardRecord } from "./Card";

interface ActionState {
    action: ActionRecord;
    card: CardRecord;
    root: CardRecord;
}
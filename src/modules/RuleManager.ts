import * as shortid from 'shortid';
import { ActionRecord } from '../models/Action';
import { Map as IMap } from 'immutable';
import { RuleRecord } from '../models/Rule';
import { cardOperations } from './CardOperations/index';
import { ActionState } from '../models/ActionState';
import * as nools from 'nools-ts';
import FlowContainer from 'nools-ts/flow-container';

class ActionType {
    data: any;
    type: string;
    constructor(type: string, data: any) {
        this.type = type;
        this.data = data;
    }
}

class RuleManager {
    state: Map<string, any>;
    flow: FlowContainer;
    result: ActionType[];

    constructor() {
        this.state = new Map<string, any>();
        this.result = [];
    }

    rule = `
    rule test {
        when {
            a : Action a.type == 'EXECUTE_COMMAND' && a.data.name == 'TEST';
        }
        then {
            r.push(new Action('SET_CARD_TAG',{name:'Test',value:'0000'}))
        }
    }
    `;

    setState(name: string, value: any) {
        this.state = this.state.set(name, value);
    }

    setRules(rules: IMap<string, RuleRecord>) {
        const defines = new Map();
        defines.set('Action', ActionType);
        let rule = rules.filter(x => !x.name.startsWith('_') && x.content.includes('when')).first();
        let content = rule ? rule.content : this.rule;
        this.flow = nools.compile(content, {
            define: defines,
            scope: new Map<string, any>([['r', this.result]])
        });
    }

    getNewActionsFrom(acts: ActionType[], actionState: ActionState) {
        let actions: ActionRecord[] = [];
        let lastCardId = actionState.action.cardId;
        for (const act of this.result) {
            let processedData = cardOperations.fixData(act.type, { ...act.data });
            actions.push(new ActionRecord({
                id: shortid.generate(),
                actionType: act.type,
                cardId: lastCardId,
                data: processedData
            }));
            if (processedData.id) {
                lastCardId = processedData.id;
            }
        }
        return actions;
    }

    getNextActions(actionState: ActionState): Promise<ActionRecord[]> {
        return new Promise<ActionRecord[]>(resolve => {
            while (this.result.length > 0) {
                this.result.pop();
            }
            let session = this.flow.getSession(new ActionType(
                actionState.action.actionType, actionState.action.data));
            session.match().then(() => {
                resolve(this.getNewActionsFrom(this.result, actionState));
            });
        });
    }
}

export default new RuleManager();
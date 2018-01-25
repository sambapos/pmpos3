import * as shortid from 'shortid';
import { ActionRecord } from '../models/Action';
import { Map as IMap } from 'immutable';
import { RuleRecord } from '../models/Rule';
import { cardOperations } from './CardOperations/index';
import { ActionState } from '../models/ActionState';
import * as nools from 'nools-ts';
import FlowContainer from 'nools-ts/flow-container';
import { CardRecord } from '../models/Card';
import CardList from './CardList';

class ActionType {
    data: any;
    type: string;
    params: {};
    constructor(type: string, data: any) {
        this.type = type;
        this.data = data;
        this.params = data.params;
    }
}

class ActionData {
    action: ActionType;
    card: CardRecord;
    root: CardRecord;
    state: Map<string, any>;

    constructor(action: ActionType, card: CardRecord, root: CardRecord, state: Map<string, any>) {
        this.action = action;
        this.card = card;
        this.root = root;
        this.state = state;
    }

    load(cardType: string, cardName: string) {
        console.log('card query', cardType, cardName);
        let result = CardList.getCardByName(cardType, cardName);
        console.log(result && result.name);
        return result;
    }
}

class ResultType {
    actions: ActionType[];

    constructor() {
        this.actions = [];
    }

    clear() {
        while (this.actions.length > 0) {
            this.actions.pop();
        }
    }

    add(type: string, data: any) {
        this.actions.push(new ActionType(type, data));
    }
}

class RuleManager {
    state: Map<string, any>;
    flows: FlowContainer[];
    result: ResultType;

    constructor() {
        this.state = new Map<string, any>();
        this.result = new ResultType;
        this.flows = [];
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
        defines.set('State', ActionData);
        defines.set('Action', ActionType);
        let filteredRules = rules
            .filter(x => !x.name.startsWith('_') && x.content.includes('when'))
            .valueSeq().toArray().filter(rule => this.testRule(rule));
        this.flows = filteredRules.map(rule => {
            return nools.compile(rule.content, {
                define: defines,
                scope: new Map<string, any>([['r', this.result]])
            });
        });
    }

    testRule(rule: RuleRecord) {
        try {
            const defines = new Map();
            defines.set('State', ActionData);
            defines.set('Action', ActionType);
            nools.compile(rule.content, {
                define: defines,
                scope: new Map<string, any>([['r', []]])
            });
            return true;
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.log('error creating rule ' + rule.name, error);
            return false;
        }
    }

    getNewActionsFrom(acts: ActionType[], actionState: ActionState) {
        let actions: ActionRecord[] = [];
        let lastCardId = actionState.action.cardId;
        for (const act of this.result.actions) {
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
            this.result.clear();
            let promises = this.flows.map(flow => {
                let session = flow.getSession(
                    new ActionData(
                        new ActionType(actionState.action.actionType, actionState.action.data),
                        actionState.card, actionState.root, this.state
                    )
                );
                return session.match();
            });
            Promise.all(promises).then(() => {
                resolve(this.getNewActionsFrom(this.result.actions, actionState));
            });
        });
    }
}

export default new RuleManager();
import * as shortid from 'shortid';
import { ActionRecord } from '../models/Action';
import { Map as IMap } from 'immutable';
import { RuleRecord } from '../models/Rule';
import { cardOperations } from './CardOperations/index';
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
        return CardList.getCardByName(cardType, cardName);
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

    constructor() {
        this.state = new Map<string, any>();
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
        defines.set('Result', ResultType);
        let filteredRules = rules
            .filter(x => !x.name.startsWith('_') && x.content.includes('when'))
            .valueSeq().toArray().filter(rule => this.testRule(rule));
        this.flows = filteredRules.map(rule => {
            return nools.compile(rule.content, {
                define: defines
            });
        });
    }

    testRule(rule: RuleRecord) {
        try {
            const defines = new Map();
            defines.set('State', ActionData);
            defines.set('Action', ActionType);
            defines.set('Result', ResultType);
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

    getNewActionsFrom(acts: ActionType[], cardId: string) {
        let actions: ActionRecord[] = [];
        let lastCardId = cardId;
        for (const act of acts) {
            let processedData = cardOperations.fixData(act.type, { ...act.data });
            if (!processedData.id) {
                processedData.id = shortid.generate();
            }
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

    async getNextActions(
        actionType: string, actionData: any,
        actionCardId: string,
        card: CardRecord, root: CardRecord)
        : Promise<ActionRecord[]> {
        return new Promise<ActionRecord[]>(resolve => {
            let promises = this.flows.map(async flow => {
                let result = new ResultType();
                let session = flow.getSession(
                    new ActionData(
                        new ActionType(actionType, actionData),
                        card, root, this.state
                    ),
                    result
                );
                await session.match();
                session.dispose();
                return result;
            });
            Promise.all(promises).then(results => {
                let result = results.reduce((r, a) => r.concat(a.actions), [] as ActionType[]);
                resolve(this.getNewActionsFrom(result, actionCardId));
            });
        });
    }
}

export default new RuleManager();
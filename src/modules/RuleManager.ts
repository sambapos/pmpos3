import * as shortid from 'shortid';
import { ActionRecord } from '../models/Action';
import { CardRecord } from '../models/Card';
import { Engine, Rule } from 'json-rules-engine';
import { Map as IMap } from 'immutable';
import { RuleRecord } from '../models/Rule';
import { Parser } from 'expr-eval';
import { cardOperations } from './CardOperations/index';

class RuleManager {

    engine: Engine;
    state: IMap<string, any>;

    constructor() {
        this.engine = new Engine();
        this.engine.addRule(this.rule);
        this.state = IMap<string, any>();
    }

    rule: any = {
        conditions: {
            all: [
                {
                    fact: 'action',
                    path: '.actionType',
                    operator: 'equal',
                    value: 'CREATE_CARD'
                },
                {
                    fact: 'card',
                    path: '.typeId',
                    operator: 'equal',
                    value: 'HkiVldrVM'
                }
            ]
        },
        event: {
            type: 'SUCCESS',
            params: {
                actions: [
                    {
                        type: 'SET_CARD_TAG',
                        params: {
                            name: 'Number',
                            value: '0000'
                        }
                    },
                    {
                        type: 'SET_CARD_TAG',
                        params: {
                            name: 'Waiter',
                            value: 'Tip',
                            amount: '=card.balance*0.1'
                        }
                    }
                ]

            }
        }
    };

    setState(name: string, value: any) {
        this.state = this.state.set(name, value);
    }

    setRules(rules: IMap<string, RuleRecord>) {
        if (this.engine) { this.engine.stop(); }
        this.engine = new Engine;
        rules
            .filter(x => x.content)
            .forEach(rule => this.engine.addRule(new Rule(rule.content)));
    }

    evaluate(v: string, root: CardRecord, card: CardRecord, action: ActionRecord) {
        if (v.startsWith && v.startsWith('=')) {
            let p = new Parser();
            let expr = p.parse(v.substr(1));
            return expr.evaluate({
                'root': root as any,
                'card': card as any,
                'action': action as any,
                'state': this.state as any
            });
        }
        return v;
    }

    processData(data: any, action: ActionRecord, root: CardRecord, card: CardRecord) {
        let result = { ...data };
        for (const key of Object.keys(data)) {
            result[key] = this.evaluate(result[key], root, card, action);
        }
        return result;
    }

    getNextActions(action: ActionRecord, root: CardRecord, card: CardRecord): Promise<ActionRecord[]> {
        return new Promise<ActionRecord[]>(resolve => {
            this.engine
                .run({ state: this.state, root, card, action })
                .then(events => {
                    let actions: ActionRecord[] = [];
                    let lastCardId = action.cardId;
                    for (const event of events) {
                        for (const act of event.params.actions) {
                            let processedData = this.processData(act.params, action, root, card);
                            processedData = cardOperations.fixData(act.type, processedData);
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
                    }
                    resolve(actions);
                });
        });
    }
}

export default new RuleManager();
import { List, Map as IMap } from 'immutable';
import { CommitRecord, Commit } from '../models/Commit';
import { CardRecord } from '../models/Card';
import { cardOperations } from './CardOperations/index';
import { ActionRecord } from '../models/Action';
import { makeDeepCommit } from '../models/makers';
import { Suggestion } from './CardOperations/Plugins/SetCardTag/AutoSuggest';
import { CardTypeRecord } from '../models/CardType';
import { Engine, Rule } from 'json-rules-engine';
import CardTagData from '../models/CardTagData';
import { Parser } from 'expr-eval';
import { RuleRecord } from '../models/Rule';

class CardList {
    commits: IMap<string, List<CommitRecord>>;
    cards: IMap<string, CardRecord>;
    cardTypes: IMap<string, CardTypeRecord>;
    cardTypeIndex: IMap<string, List<string>>;
    engine: Engine;

    constructor() {
        this.commits = IMap<string, List<CommitRecord>>();
        this.cards = IMap<string, CardRecord>();
        this.cardTypes = IMap<string, CardTypeRecord>();
        this.engine = new Engine();
        this.engine.addRule(this.rule);
    }

    setRules(rules: IMap<string, RuleRecord>) {
        if (this.engine) { this.engine.stop(); }
        this.engine = new Engine;
        rules.forEach(rule => this.engine.addRule(new Rule(rule.content)));
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

    evaluate(v: string, root: CardRecord, card: CardRecord, action: ActionRecord) {
        if (v.startsWith('=')) {
            let p = new Parser();
            let expr = p.parse(v.substr(1));
            return expr.evaluate({
                'root': root as any,
                'card': card as any,
                'action': action as any
            });
        }
        return v;
    }

    getNextActions(action: ActionRecord, root: CardRecord, card: CardRecord): Promise<ActionRecord[]> {
        return new Promise<ActionRecord[]>(resolve => {
            this.engine
                .run({ root, card, action })
                .then(events => {
                    let actions: ActionRecord[] = [];
                    for (const event of events) {
                        actions.push(
                            ...event.params.actions.map(ac => {
                                let processedData = { ...ac.params };
                                Object.keys(ac.params)
                                    .forEach(p => processedData[p]
                                        = this.evaluate(processedData[p], root, card, action));
                                return new ActionRecord({
                                    actionType: ac.type,
                                    cardId: action.data.id || card.id,
                                    data: processedData
                                });
                            })
                        );
                    }
                    resolve(actions);
                });
        });

        // if (action.actionType === 'CREATE_CARD') {
        //     return [new ActionRecord({
        //         actionType: 'SET_CARD_TAG',
        //         cardId: action.data.id,
        //         data: {
        //             name: 'Number',
        //             value: '0000'
        //         }
        //     })];
        // }

        // return [];
    }

    setCardTypes(cardTypes: IMap<string, CardTypeRecord>) {
        this.cardTypes = cardTypes;
    }

    readConcurrencyData(actionType: string, card: CardRecord, actionData: any): any {
        return cardOperations.getConcurrencyData(actionType, card, actionData);
    }

    applyAction(card: CardRecord = new CardRecord(), action: ActionRecord, executeRules: boolean = false): CardRecord {
        if (cardOperations.canHandle(action)) {
            return cardOperations.reduce(card, action);
        }
        return card;
    }

    canApplyAction(card: CardRecord, action: ActionRecord): boolean {
        return cardOperations.canApplyAction(card, action);
    }

    actionReduce = (card: CardRecord, action: ActionRecord) => {
        return this.applyAction(card, action);
    }

    commitReduce = (card: CardRecord, commit: CommitRecord) => {
        return commit.actions.reduce(this.actionReduce, card);
    }

    addCommits(commits: Commit[]) {
        commits.forEach(x => this.addCommit(x));
        this.cardTypeIndex = this.cards.reduce(
            (r: IMap<string, List<string>>, card) => {
                return r.update(card.typeId, list => {
                    if (!list) {
                        list = List<string>();
                    }
                    return list.push(card.id);
                });
            },
            IMap<string, List<string>>());
    }

    getCards(): IMap<string, CardRecord> {
        return this.cards;
    }

    getCardTypes(): IMap<string, CardTypeRecord> {
        return this.cardTypes;
    }

    reduceTags(card: CardRecord, list: List<CardTagData>, filters: string[]) {
        let foundTags = card.getTags(filters);
        list = list.merge(foundTags.result
            .map(ft => { return new CardTagData(foundTags.filter, ft, card); }));
        return card.cards.reduce((r, c) => this.reduceTags(c, r, filters), list);
    }

    getTags(filters: string[]): List<CardTagData> {
        return this.cards.reduce((r, card) => this.reduceTags(card, r, filters), List<CardTagData>());
    }

    getCardsByType(typeId: string): List<CardRecord> {
        if (typeId && this.cardTypeIndex) {
            let index = this.cardTypeIndex.get(typeId);
            if (index) {
                return index.map(id => this.cards.get(id) as CardRecord) || List<CardRecord>();
            }
        }
        return List<CardRecord>();
    }

    getCard(id: string): CardRecord {
        return this.cards.get(id) as CardRecord;
    }

    getCommits(id: string): List<CommitRecord> | undefined {
        return this.commits.get(id);
    }

    getCardSuggestions(ref: string, value: string): Suggestion[] {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        if (inputLength === 0) { return []; }

        let cardType = this.cardTypes
            .find(x => x.reference === ref) || new CardTypeRecord();

        let result = [] as Suggestion[];
        if (cardType.name) {
            let index = this.cardTypeIndex.get(cardType.id) || List<string>();
            let cards = index.map(id => this.cards.get(id) as CardRecord);
            result = cards
                .filter(c => c.name.toLowerCase().trim().includes(inputValue))
                .map(c => {
                    return { label: c.name };
                })
                .toArray();
        }
        return result;
    }

    private addCommit(commit: Commit) {
        this.commits = this.commits.update(commit.cardId, list => {
            if (!list) { list = List<CommitRecord>(); }
            return list.push(makeDeepCommit(commit));
        });
        this.cards = this.cards.update(commit.cardId, cardRecord => {
            let commits = this.commits.get(commit.cardId) as List<CommitRecord>;
            return commits
                .sort((a, b) => a.time - b.time)
                .reduce(this.commitReduce, new CardRecord());
        });
    }
}

export default new CardList();
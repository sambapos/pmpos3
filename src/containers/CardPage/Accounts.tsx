import * as React from 'react';
import { WithStyles, Card, Typography } from 'material-ui';
import decorate, { Style } from './style';
import { CardRecord } from '../../models/Card';
import { CardTagRecord } from '../../models/CardTag';
import { Map as IMap, List } from 'immutable';

type AccountProps =
    { card: CardRecord }
    & WithStyles<keyof Style>;

const reduceCardTags = (card: CardRecord, list: IMap<CardRecord, List<CardTagRecord>>) => {
    let result = list.set(card, card.tags.valueSeq().toList());
    return card.cards.reduce((r, c) => reduceCardTags(c, result), result);
};

const Accounts = (props: AccountProps) => {
    return (
        <div style={{ wordWrap: 'break-word' }}>
            <Card className={props.classes.card}>
                <Typography>Accounts</Typography>
                {
                    reduceCardTags(props.card, IMap<CardRecord, List<CardTagRecord>>())
                        .map((tags, card) =>
                            tags.map(tag => <div key={tag.id}>{tag.value}-{card.balance}</div>)
                        ).valueSeq().toArray()
                }
            </Card>
        </div>
    );
};

export default decorate(Accounts);
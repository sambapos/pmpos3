import * as React from 'react';
import { WithStyles, Card, Typography } from 'material-ui';
import decorate, { Style } from './style';
import { CardRecord } from '../../models/Card';

type AccountProps =
    { card: CardRecord }
    & WithStyles<keyof Style>;

const Accounts = (props: AccountProps) => {
    return (
        <div style={{ wordWrap: 'break-word' }}>
            <Card className={props.classes.card}>
                <Typography>Accounts</Typography>
                Here, we'll see details of card accounts.
                <div>
                    {props.card.id}
                </div>
            </Card>
        </div>
    );
};

export default decorate(Accounts);
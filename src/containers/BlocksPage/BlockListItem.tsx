import * as React from 'react';
import { List } from 'immutable';
import { WithStyles, ListItem, Paper } from 'material-ui';
import decorate, { Style } from './style';
import BlockHeader from './BlockHeader';
import Actions from './Actions';

const BlockListItem = (props: {
    bid: string,
    onClick: () => void,
    isSelected: boolean,
    actions: List<any>
} & WithStyles<keyof Style>) => {
    return (
        <ListItem
            button
            onClick={props.onClick}
        >
            <Paper className={props.classes.listItem}>
                <BlockHeader
                    bid={props.bid}
                    isSelected={props.isSelected}
                />
                <Actions items={props.actions} />
            </Paper>
        </ListItem>
    );
};

export default decorate(BlockListItem);
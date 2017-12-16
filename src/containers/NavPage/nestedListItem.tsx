import * as React from 'react';
import { ListItem, ListItemText, WithStyles } from 'material-ui';
import withStyles from 'material-ui/styles/withStyles';

const decorate = withStyles(({ palette, spacing }) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        background: palette.background.paper,
    },
    nested: {
        paddingLeft: spacing.unit * 4,
    },
}));

interface NestedListItemProps {
    label: string;
    onClick: () => void;
}

type Props = NestedListItemProps & WithStyles<'root' | 'nested'>;

class NestedListItem extends React.Component<Props, {}> {

    render() {
        return (
            <ListItem
                className={this.props.classes.nested}
                button
                onClick={() => this.props.onClick()}
            >
                <ListItemText primary={this.props.label} />
            </ListItem>
        );
    }
}
export default decorate<NestedListItemProps>(NestedListItem);
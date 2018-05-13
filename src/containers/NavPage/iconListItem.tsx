import * as React from 'react';
import { ListItem, ListItemText } from 'material-ui';

interface IconListItemProps {
    mainText: string;
    icon?: string;
    onClick: () => void;
}

class IconListItem extends React.Component<IconListItemProps, {}> {
    public render() {
        return (
            <ListItem button onClick={() => this.props.onClick()}>
                {this.props.icon && <i className="material-icons">{this.props.icon}</i>}
                <ListItemText primary={this.props.mainText} />
            </ListItem>
        );
    }
}
export default IconListItem;
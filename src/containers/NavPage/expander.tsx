import * as React from 'react';
import { ListItem, ListItemText, Collapse, List } from 'material-ui';

interface IExpanderProps {
    mainText: string;
}

type Props = IExpanderProps;

class Expander extends React.Component<Props, { expanded: boolean }> {

    public state = { expanded: false };

    public render() {
        return (
            <div>
                <ListItem button onClick={this.handleClick}>
                    <ListItemText primary={this.props.mainText} />
                    {this.state.expanded
                        ? <i className="material-icons">expand_less</i>
                        : <i className="material-icons">expand_more</i>}
                </ListItem>
                <Collapse component="li" in={this.state.expanded} timeout="auto" unmountOnExit>
                    <List disablePadding>
                        {this.props.children}
                    </List>
                </Collapse>
            </div>
        );
    }

    private handleClick = () => {
        this.setState({ expanded: !this.state.expanded });
    }
}
export default Expander;
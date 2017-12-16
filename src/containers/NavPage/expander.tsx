import * as React from 'react';
import { ListItem, ListItemText, Collapse, List } from 'material-ui';

interface ExpanderProps {
    mainText: string;
}

type Props = ExpanderProps;

class Expander extends React.Component<Props, { expanded: boolean }> {

    state = { expanded: false };

    handleClick = () => {
        this.setState({ expanded: !this.state.expanded });
    }

    render() {
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
}
export default Expander;
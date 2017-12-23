import * as React from 'react';
import * as History from 'history';
import List from 'material-ui/List';
import Expander from './expander';
import NestedListItem from './nestedListItem';
import IconListItem from './iconListItem';

interface NavListProps {
    history: History.History;
    closeDrawer: () => void;
}

export default class extends React.Component<NavListProps> {

    nav(link: string) {
        this.props.history.push(link);
        if (this.props.closeDrawer && window.innerWidth < 1024) { this.props.closeDrawer(); }
    }

    render() {
        return (
            <List>
                <IconListItem mainText="Dashboard" icon="dashboard" onClick={() => this.nav('/')} />
                <IconListItem mainText="POS" icon="grid_on" onClick={() => this.nav('/')} />
                <IconListItem mainText="Documents" icon="description" onClick={() => this.nav('/documents')} />
                <IconListItem mainText="Tasks" icon="toc" onClick={() => this.nav('/tasks')} />
                <IconListItem mainText="Chat" icon="chat" onClick={() => this.nav('/chat')} />
                <IconListItem mainText="Blocks" icon="short_text" onClick={() => this.nav('/blocks')} />
                <Expander mainText="Management" >
                    <NestedListItem label="Document Types" onClick={() => this.nav('/')} />
                </Expander>
            </List>
        );
    }
}
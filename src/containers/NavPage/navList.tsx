import * as React from 'react';
import * as History from 'history';
import List from 'material-ui/List';
import Expander from './expander';
import NestedListItem from './nestedListItem';
import IconListItem from './iconListItem';
import Divider from 'material-ui/Divider/Divider';

interface NavListProps {
    loggedInUser: string;
    history: History.History;
    closeDrawer: () => void;
}

export default class extends React.Component<NavListProps> {

    nav(link: string) {
        this.props.history.push(link);
        if (this.props.closeDrawer && window.innerWidth < 1024) { this.props.closeDrawer(); }
    }

    getUser() {
        if (this.props.loggedInUser) {
            return ` (${this.props.loggedInUser})`;
        }
        return '';
    }

    render() {
        return (
            <List>
                <IconListItem
                    mainText={'Login' + this.getUser()}
                    icon="account_circle"
                    onClick={() => this.nav('/login')}
                />
                <Divider />
                <IconListItem mainText="Dashboard" icon="dashboard" onClick={() => this.nav('/')} />
                <IconListItem mainText="POS" icon="grid_on" onClick={() => this.nav('/')} />
                <IconListItem mainText="Cards" icon="description" onClick={() => this.nav('/cards')} />
                <IconListItem mainText="Tags" icon="description" onClick={() => this.nav('/tags')} />
                <IconListItem mainText="Tasks" icon="toc" onClick={() => this.nav('/tasks')} />
                <IconListItem mainText="Chat" icon="chat" onClick={() => this.nav('/chat')} />
                <Expander mainText="Management" >
                    <NestedListItem label="Card Types" onClick={() => this.nav('/cardTypes')} />
                </Expander>
            </List>
        );
    }
}
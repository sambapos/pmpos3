import * as React from 'react';
import * as History from 'history';
import List from 'material-ui/List';
import Expander from './expander';
import NestedListItem from './nestedListItem';
import IconListItem from './iconListItem';
import Divider from 'material-ui/Divider/Divider';

interface INavListProps {
    loggedInUser: string;
    history: History.History;
    closeDrawer: () => void;
}

export default class extends React.Component<INavListProps> {

    public render() {
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
                <IconListItem mainText="Report" icon="toc" onClick={() => this.nav('/report')} />
                <Expander mainText="Management" >
                    <NestedListItem label="Card Types" onClick={() => this.nav('/cardTypes')} />
                    <NestedListItem label="Tag Types" onClick={() => this.nav('/tagTypes')} />
                    <NestedListItem label="Rules" onClick={() => this.nav('/rules')} />
                </Expander>
            </List>
        );
    }

    private nav(link: string) {
        this.props.history.push(process.env.PUBLIC_URL + link);
        if (this.props.closeDrawer && window.innerWidth < 1024) { this.props.closeDrawer(); }
    }

    private getUser() {
        if (this.props.loggedInUser) {
            return ` (${this.props.loggedInUser})`;
        }
        return '';
    }

}
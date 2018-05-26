import * as React from 'react';
import * as History from 'history';
import { Map as IMap } from 'immutable';
import Expander from './expander';
import NestedListItem from './nestedListItem';
import IconListItem from './iconListItem';
import { List, Divider } from '@material-ui/core';
import { DataBuilder, ConfigManager, CardManager } from 'pmpos-core';

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
                {/* <IconListItem mainText="POS" icon="grid_on" onClick={() => this.props.posSelected()} /> */}
                <IconListItem mainText="Cards" icon="description" onClick={() => this.nav('/cards')} />
                <IconListItem mainText="Report" icon="toc" onClick={() => this.nav('/report')} />
                <Expander mainText="Management" >
                    {this.props.loggedInUser && this.noCardsExists() && <NestedListItem label="Create Test Config" onClick={() => this.createDefaultConfig()} />}
                    <NestedListItem label="Card Types" onClick={() => this.nav('/cardTypes')} />
                    <NestedListItem label="Tag Types" onClick={() => this.nav('/tagTypes')} />
                    <NestedListItem label="Rules" onClick={() => this.nav('/rules')} />
                </Expander>
            </List>
        );
    }

    private noCardsExists = () => CardManager.getCards().count() === 0;

    private createDefaultConfig() {
        const db = new DataBuilder();
        const config = db.createConfig();
        ConfigManager.saveCardTypes(config.get('cardTypes') as IMap<string, any>);
        ConfigManager.saveTagTypes(config.get('tagTypes') as IMap<string, any>);
        ConfigManager.saveRules(config.get('rules') as IMap<string, any>);
        if (CardManager.getCards().count() === 0) {
            CardManager.postCommits(db.getDefaultCardCommits());
        }
        this.props.closeDrawer();
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
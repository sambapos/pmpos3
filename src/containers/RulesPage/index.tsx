import * as React from 'react';
import { connect } from 'react-redux';
import * as ConfigStore from '../../store/Config';
import { RouteComponentProps } from 'react-router';
import { WithStyles, List, ListItem, Paper, Divider, ListItemText } from '@material-ui/core';
import decorate, { IStyle } from './style';
import { IApplicationState } from '../../store/index';
import { Map as IMap } from 'immutable';
import TopBar from '../TopBar';
import { RuleRecord } from 'pmpos-models';

type PageProps =
    { rules: IMap<string, RuleRecord> }
    & WithStyles<keyof IStyle>
    & typeof ConfigStore.actionCreators
    & RouteComponentProps<{}>;

class RulesPage extends React.Component<PageProps, {}> {

    public render() {
        return (
            <div className={this.props.classes.root}>
                <TopBar
                    title="Rules"
                    secondaryCommands={this.getSecondaryCommands()}
                />

                <Paper className={this.props.classes.content}>
                    <List>
                        {this.renderRules(this.props.rules.valueSeq().toArray())}
                    </List>
                </Paper>
            </div>
        );
    }

    private getSecondaryCommands() {
        const result = [
            {
                icon: 'add', onClick: () => {
                    this.props.history.push(process.env.PUBLIC_URL + '/rule');
                    this.props.addRule();
                }
            }
        ];
        return result;
    }

    private renderRules(rules: RuleRecord[]) {
        return rules.map(rule => {
            return rule && (
                <div key={rule.id}>
                    <ListItem
                        button
                        onClick={(e) => {
                            this.props.history.push(process.env.PUBLIC_URL + '/rule');
                            this.props.loadRule(rule.id);
                            e.preventDefault();
                        }}
                    >
                        <ListItemText
                            primary={rule.name}
                            secondary={rule.id}
                        />
                    </ListItem>
                    <Divider />
                </div>
            );
        });
    }
}

const mapStateToProps = (state: IApplicationState) => ({
    rules: state.config.rules,
});

export default decorate(connect(
    mapStateToProps,
    ConfigStore.actionCreators
)(RulesPage));
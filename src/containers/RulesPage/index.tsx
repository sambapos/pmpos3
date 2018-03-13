import * as React from 'react';
import { connect } from 'react-redux';
import * as ConfigStore from '../../store/Config';
import { RouteComponentProps } from 'react-router';
import { WithStyles, List, ListItem, Paper } from 'material-ui';
import decorate, { Style } from './style';
import { ApplicationState } from '../../store/index';
import { Map as IMap } from 'immutable';
import TopBar from '../TopBar';
import Divider from 'material-ui/Divider/Divider';
import ListItemText from 'material-ui/List/ListItemText';
import { RuleRecord } from '../../models/Rule';

type PageProps =
    { rules: IMap<string, RuleRecord> }
    & WithStyles<keyof Style>
    & typeof ConfigStore.actionCreators
    & RouteComponentProps<{}>;

class RulesPage extends React.Component<PageProps, {}> {

    getSecondaryCommands() {
        let result = [
            {
                icon: 'add', onClick: () => {
                    this.props.history.push(process.env.PUBLIC_URL + '/rule');
                    this.props.addRule();
                }
            }
        ];
        return result;
    }

    renderRules(rules: RuleRecord[]) {
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
}

const mapStateToProps = (state: ApplicationState) => ({
    rules: state.config.rules,
});

export default decorate(connect(
    mapStateToProps,
    ConfigStore.actionCreators
)(RulesPage));
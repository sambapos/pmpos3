import * as React from 'react';
import { connect } from 'react-redux';
import * as ConfigStore from '../../store/Config';
import { RouteComponentProps } from 'react-router';
import { WithStyles, List, ListItem, Paper, Divider, ListItemText } from '@material-ui/core';
import decorate, { IStyle } from './style';
import { IApplicationState } from '../../store/index';
import { Map as IMap } from 'immutable';
import TopBar from '../TopBar';
import { CardTypeRecord } from 'sambadna-core';

type PageProps =
    { cardTypes: IMap<string, CardTypeRecord> }
    & WithStyles<keyof IStyle>
    & typeof ConfigStore.actionCreators
    & RouteComponentProps<{}>;

class CardTypesPage extends React.Component<PageProps, {}> {

    public render() {
        return (
            <div className={this.props.classes.root}>
                <TopBar
                    title="Card Types"
                    secondaryCommands={this.getSecondaryCommands()}
                />

                <Paper className={this.props.classes.content}>
                    <List>
                        {this.renderCards(this.props.cardTypes.valueSeq()
                            .sort((x, y) => x.name > y.name ? 1 : -1)
                            .toArray())}
                    </List>
                </Paper>
            </div>
        );
    }

    private getSecondaryCommands() {
        const result = [
            {
                icon: 'add', onClick: () => {
                    this.props.history.push(process.env.PUBLIC_URL + '/cardType');
                    this.props.addCardType();
                }
            }
        ];
        return result;
    }

    private renderCards(cardTypes: CardTypeRecord[]) {
        return cardTypes.sort((c1, c2) => c1.name < c2.name ? -1 : 1).map(cardType => {
            return cardType && (
                <div key={cardType.id}>
                    <ListItem
                        button
                        onClick={(e) => {
                            this.props.history.push(process.env.PUBLIC_URL + '/cardType');
                            this.props.loadCardType(cardType.id);
                            e.preventDefault();
                        }}
                    >
                        <ListItemText
                            primary={cardType.name}
                            secondary={cardType.id}
                        />
                    </ListItem>
                    <Divider />
                </div>
            );
        });
    }
}

const mapStateToProps = (state: IApplicationState) => ({
    cardTypes: state.config.cardTypes,
});

export default decorate(connect(
    mapStateToProps,
    ConfigStore.actionCreators
)(CardTypesPage));
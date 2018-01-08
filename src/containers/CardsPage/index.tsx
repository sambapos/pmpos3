import * as React from 'react';
import { connect } from 'react-redux';
import * as CardStore from '../../store/Cards';
import { RouteComponentProps } from 'react-router';
import { WithStyles, List, ListItem, ListItemSecondaryAction } from 'material-ui';
import decorate, { Style } from './style';
import { ApplicationState } from '../../store/index';
import { Map as IMap } from 'immutable';
import TopBar from '../TopBar';
import { CardRecord } from '../../models/Card';
import Divider from 'material-ui/Divider/Divider';
import ListItemText from 'material-ui/List/ListItemText';

type PageProps =
    { cards: IMap<string, CardRecord>, card: CardRecord }
    & WithStyles<keyof Style>
    & typeof CardStore.actionCreators
    & RouteComponentProps<{}>;

class CardsPage extends React.Component<PageProps, {}> {
    createTestCards() {
        for (let index = 0; index < 100; index++) {
            this.props.addCard();
            for (let index1 = 0; index1 < 50; index1++) {
                this.props.addPendingAction(undefined, 'SET_CARD_TAG', {
                    name: 'Tag' + index1, value: 'Value' + index1
                });
            }
            // this.props.commitCard();
        }
    }

    getSecondaryCommands() {
        let result = [
            {
                icon: 'add', onClick: () => {
                    this.props.addCard();
                    this.props.history.push('/card');
                }
            }
        ];
        return result;
    }

    renderCards(cards: CardRecord[]) {
        return cards.map(card => {
            return card && (
                <div key={card.id}>
                    <ListItem
                        button
                        onClick={(e) => {
                            this.props.history.push('/card/' + card.id);
                            e.preventDefault();
                        }}
                    >
                        <ListItemText
                            primary={card.display}
                            secondary={card.tags.valueSeq().map(tag => (
                                <span
                                    style={{ marginRight: '8px' }}
                                    key={tag.name}
                                >
                                    {tag.display}
                                </span>))}
                        />
                        <ListItemSecondaryAction>
                            {card.balanceDisplay}
                        </ListItemSecondaryAction>
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
                    title="Cards"
                    secondaryCommands={this.getSecondaryCommands()}
                />

                <div className={this.props.classes.content}>
                    <List>
                        {this.renderCards(this.props.cards.valueSeq().toArray())}
                    </List>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    cards: state.cards.cards,
    card: state.cards.currentCard
});

export default decorate(connect(
    mapStateToProps,
    CardStore.actionCreators
)(CardsPage));
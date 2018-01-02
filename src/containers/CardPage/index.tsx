import * as React from 'react';
import { connect } from 'react-redux';
import * as CardStore from '../../store/Cards';
import { RouteComponentProps } from 'react-router';
import { WithStyles, Modal } from 'material-ui';
import decorate, { Style } from './style';
import * as moment from 'moment';
import { ApplicationState } from '../../store/index';
import TopBar from '../TopBar';
import { List } from 'immutable';
import { ActionRecord } from '../../models/Action';
import { CardRecord } from '../../models/Card';
import { cardOperations } from '../../modules/CardOperations';
import CardOperation from '../../modules/CardOperations/CardOperation';

export type PageProps =
    {
        isLoaded: boolean,
        pendingActions: List<ActionRecord>
        card: CardRecord
    }
    & WithStyles<keyof Style>
    & typeof CardStore.actionCreators
    & RouteComponentProps<{ id?: string }>;

class CardPage extends React.Component<
    PageProps,
    { operations: CardOperation[], operationComponent: any, open: boolean }> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            operations: cardOperations.getOperations(),
            operationComponent: undefined,
            open: false
        };
    }
    public componentDidMount() {
        if (this.props.match.params.id) { this.props.loadCard(this.props.match.params.id); }
    }
    public handleCardMutation = (actionType: string, data: any) => {
        this.setState({ open: false });
        this.props.executeCardAction(actionType, data);
    }
    handleOpen = () => {
        this.setState({ open: true });
    }

    handleClose = () => {
        this.setState({ open: false });
    }

    public render() {
        if (!this.props.isLoaded || !this.props.card) { return <div>Loading</div>; }
        return (
            <div>
                <TopBar
                    title="Card"
                    menuCommand={{ icon: 'close', onClick: () => { this.props.history.goBack(); } }}
                    secondaryCommands={[
                        {
                            icon: 'check', onClick: () => {
                                this.props.commitCard();
                                this.props.history.push('/cards');
                            }
                        }
                    ]}
                />
                <p>{this.props.card.id}</p>
                <p>{moment(this.props.card.time).format('LLLL')}</p>
                <ul>
                    {this.state.operations.map(x => (
                        <li key={x.type}>
                            <a
                                href="#"
                                onClick={e => {
                                    this.setState({
                                        open: true,
                                        operationComponent: x.getEditor && x.getEditor(this.handleCardMutation)
                                    });
                                    e.preventDefault();
                                }}
                            >{x.description}
                            </a>
                        </li>
                    ))}
                </ul>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    show={this.state.open}
                    onRequestClose={this.handleClose}
                >
                    <div className={this.props.classes.modal}>
                        {this.state.operationComponent}
                    </div>
                </Modal>

                <ul>
                    {
                        this.props.card.tags.entrySeq().map(([k, v]: any[]) => {
                            return (<li key={k}>{k}:{v}</li>);
                        })
                    }
                </ul>
            </div>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    card: state.cards.currentCard,
    pendingActions: state.cards.pendingActions,
    isLoaded: state.cards.isLoaded
});

export default decorate(connect(
    mapStateToProps,
    CardStore.actionCreators
)(CardPage));
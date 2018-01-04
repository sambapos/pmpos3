import * as React from 'react';
import * as shortid from 'shortid';
import * as moment from 'moment';
import Tags from './Tags';
import Operations from './Operations';
import SubCards from './SubCards';
import { CardRecord, CardTagRecord } from '../../models/Card';
import CardOperation from '../../modules/CardOperations/CardOperation';
import { Modal, WithStyles, Typography } from 'material-ui';
import decorate, { Style } from './style';

interface CardContentProps {
    card: CardRecord;
    operations: CardOperation[];
    executeCardAction: (card: CardRecord, actionType: string, data: any) => void;
}

interface CardContentState {
    operationComponent: any;
    open: boolean;
}

type PageProps = CardContentProps & WithStyles<keyof Style>;

class CardPageContent extends React.Component<PageProps, CardContentState> {

    constructor(props: PageProps) {
        super(props);
        this.state = { open: false, operationComponent: undefined };
    }

    handleOpen = () => {
        this.setState({ open: true });
    }

    handleClose = () => {
        this.setState({ open: false });
    }

    handleTagClick = (tagName: string, value: CardTagRecord) => {
        let op = this.props.operations.find(x => x.type === 'SET_CARD_TAG');
        if (op) {
            this.setState({
                open: true,
                operationComponent: op.getEditor
                    && op.getEditor(this.handleCardMutation, value)
            });
        }
    }

    handleCardMutation = (actionType: string, data: any) => {
        this.setState({ open: false });
        this.props.executeCardAction(this.props.card, actionType, data);
    }

    handleOperation(operation: CardOperation) {
        if (operation.getEditor) {
            this.setState({
                open: true,
                operationComponent: operation.getEditor && operation.getEditor(this.handleCardMutation)
            });
        } else {
            this.handleCardMutation(operation.type, {
                id: shortid.generate(), time: new Date().getTime()
            });
        }
    }

    render() {
        return (
            <div>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <div className={this.props.classes.modal}>
                        {this.state.operationComponent}
                    </div>
                </Modal>
                <Operations
                    card={this.props.card}
                    operations={this.props.operations}
                    onClick={op => this.handleOperation(op)}
                />
                <Typography>{this.props.card.id}</Typography>
                <Typography>{moment(this.props.card.time).format('LLL')}</Typography>

                <Tags card={this.props.card} handleTagClick={this.handleTagClick} />
                <SubCards
                    card={this.props.card}
                    operations={this.props.operations}
                    executeCardAction={this.props.executeCardAction}
                />
            </div>
        );
    }
}

export default decorate(CardPageContent);
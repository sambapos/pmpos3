import * as React from 'react';
import * as shortid from 'shortid';
import CardOperation from '../../modules/CardOperations/CardOperation';
import Button from 'material-ui/Button/Button';
import { Modal } from 'material-ui';
import { WithStyles } from 'material-ui/styles/withStyles';
import decorate, { Style } from './style';

interface OperationsProps {
    operations: CardOperation[];
    currentAction?: { type: string, data: any };
    handleCardMutation: (actionType: string, data: any) => void;
}

interface OperationsState {
    operationComponent: any;
    open: boolean;
}

type PageProps = OperationsProps & WithStyles<keyof Style>;

class FooterOperations extends React.Component<PageProps, OperationsState> {

    constructor(props: PageProps) {
        super(props);
        this.state = { operationComponent: undefined, open: false };
    }

    handleOpen = () => {
        this.setState({ open: true });
    }

    handleClose = () => {
        this.setState({ open: false });
    }

    handleMutation(actionType: string, data: any) {
        this.props.handleCardMutation(actionType, data);
        this.handleClose();
    }

    handleOperation(operation: CardOperation, currentData?: any) {
        if (operation.getEditor) {
            this.setState({
                open: true,
                operationComponent: operation.getEditor
                    && operation.getEditor((at, data) => this.handleMutation(at, data), currentData)
            });
        } else {
            this.props.handleCardMutation(operation.type, {
                id: shortid.generate(), time: new Date().getTime()
            });
        }
    }

    componentWillReceiveProps(nextProps: PageProps) {
        if (nextProps.currentAction) {
            let currentAction = nextProps.currentAction;
            let operation = this.props.operations.find(x => x.type === currentAction.type);
            if (operation) {
                let currentData = nextProps.currentAction ? nextProps.currentAction.data : undefined;
                this.handleOperation(operation, currentData);
            }
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
                {
                    this.props.operations.map(option => (
                        <Button
                            key={option.type}
                            onClick={e => {
                                this.handleOperation(option);
                            }}
                        >
                            {option.description}
                        </Button>
                    ))
                }
            </div>
        );
    }
}

export default decorate(FooterOperations);
import * as React from 'react';
import { Button } from 'material-ui';
import DialogContent from 'material-ui/Dialog/DialogContent';
import DialogTitle from 'material-ui/Dialog/DialogTitle';
import decorate, { Style } from './style';
import { WithStyles } from 'material-ui/styles/withStyles';
import RuleManager from '../../../RuleManager';
import CardList from '../../../CardList';

interface State {
    cardType: string;
    buttons: string[];
    selectedTag: string;
}

interface PageProps {
    success: (actionType: string, data: any) => void;
    cancel: () => void;
    actionName: string;
    current?: any;
}

type Props = PageProps & WithStyles<keyof Style>;

class Component extends React.Component<Props, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            cardType: '',
            buttons: [],
            selectedTag: ''
        };
    }

    componentDidMount() {
        if (this.props.current && this.state.buttons.length === 0) {
            let ctId = CardList.getCardTypeIdByRef(this.props.current.type);
            if (ctId) {
                this.setState({
                    selectedTag: this.props.current.selected,
                    cardType: this.props.current.type,
                    buttons: CardList.getCardsByType(ctId).map(x => x.name).toArray()
                });
            }
        }
    }

    render() {
        return (
            <>
            <DialogTitle>{`Select ${this.state.cardType}`}</DialogTitle>
            <DialogContent>
                <div className={this.props.classes.buttonContainer}>
                    {this.state.buttons
                        .map(caption => (
                            <Button
                                raised
                                className={this.props.classes.selectionButton}
                                color={caption === this.state.selectedTag ? 'secondary' : 'default'}
                                key={'b_' + caption}
                                onClick={() => {
                                    RuleManager.state.set(this.state.cardType, caption);
                                    this.props.success(this.props.actionName, this.props.current);
                                }}
                            >
                                {caption}
                            </Button>
                        ))}
                </div>
            </DialogContent>
            </>
        );
    }
}

export default decorate(Component);
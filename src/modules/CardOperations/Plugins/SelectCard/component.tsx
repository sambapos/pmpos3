import * as React from 'react';
import { Button } from 'material-ui';
import DialogContent from 'material-ui/Dialog/DialogContent';
import DialogTitle from 'material-ui/Dialog/DialogTitle';
import decorate, { Style } from './style';
import { WithStyles } from 'material-ui/styles/withStyles';
import RuleManager from '../../../RuleManager';
import CardList from '../../../CardList';
import TextField from 'material-ui/TextField/TextField';

interface State {
    cardType: string;
    buttons: string[];
    selectedTag: string;
    searchValue: string;
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
            selectedTag: '',
            searchValue: ''
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
                <TextField
                    style={{ marginBottom: '8px' }}
                    fullWidth
                    label="Search"
                    value={this.state.searchValue}
                    onChange={e => this.setState({ searchValue: e.target.value })}
                />
                <div className={this.props.classes.buttonContainer}>
                    {this.state.buttons
                        .filter(x => !this.state.searchValue || x.includes(this.state.searchValue))
                        .map(caption => (
                            <Button
                                variant="raised"
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
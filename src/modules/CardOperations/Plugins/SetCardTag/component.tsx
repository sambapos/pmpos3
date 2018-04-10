import * as React from 'react';
import { TextField, Button, DialogContent, DialogTitle, DialogActions } from 'material-ui';
import * as shortid from 'shortid';
import AutoSuggest from '../../../../components/AutoSuggest';
import CardList from '../../../CardList';
import { CardTagRecord } from '../../../../models/CardTag';
import { Fragment } from 'react';
import { TagTypeRecord } from '../../../../models/TagType';
import { CardRecord } from '../../../../models/Card';

interface Props {
    card: CardRecord;
    success: (actionType: string, data: any) => void;
    cancel: () => void;
    actionName: string;
    current: { tagType: TagTypeRecord, tag: CardTagRecord };
}

interface State {
    name: string; value: string; quantity: string; unit: string;
    amount: string; func: string;
    source: string; target: string; typeId: string;
}

const getState = (props: Props): State => {
    let { tagType, tag } = props.current;
    return {
        typeId: tagType.id,
        name: tag.name || tagType.cardTypeReferenceName,
        value: tag.value || tagType.defaultValue,
        quantity: String(tag.quantity !== 0 ? tag.quantity : tagType.defaultQuantity),
        unit: tag.unit || tagType.defaultUnit,
        amount: String(tag.amount !== 0 ? tag.amount : tagType.defaultAmount),
        func: tag.func || tagType.defaultFunction,
        source: tag.source || tagType.defaultSource,
        target: tag.target || tagType.defaultTarget
    };
};

export default class extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = getState(props);
    }
    componentDidMount() {
        if (this.props.current && this.props.current.tag) {
            this.setState(getState(this.props));
        }
    }
    handleTagValueChange(value: string) {
        this.setState({ value });
        if (this.props.current.tagType.cardTypeReferenceName) {
            let card = CardList.getCardByName(this.props.current.tagType.cardTypeReferenceName, value);
            if (card) {
                if (Number(this.state.amount) === 0) {
                    this.setState({ amount: String(card.getTag('Amount', '')) });
                }
                if (!this.state.source) {
                    this.setState({ source: String(card.getTag('Source', '')) });
                }
                if (!this.state.target) {
                    this.setState({ target: String(card.getTag('Target', '')) });
                }
            }
        }
    }
    render() {
        let tagType = this.props.current.tagType;
        let canEditName = Boolean(
            !this.props.current.tag.name && !tagType.id
        );
        let canEditValue = !tagType.id || tagType.showValue;
        let canEditQuantity = !tagType.id || tagType.showQuantity;
        let canEditUnit = !tagType.id || tagType.showUnit;
        let canEditAmount = !tagType.id || tagType.showAmount;
        let canEditSource = !tagType.id || tagType.showSource;
        let canEditTarget = !tagType.id || tagType.showTarget;
        let canEditFunction = !tagType.id || tagType.showFunction;

        return (
            <Fragment>
                <DialogTitle>{
                    `Set ${tagType.id
                        ? tagType.cardTypeReferenceName
                        : ' Card Tag'}`
                }
                </DialogTitle>
                <DialogContent>
                    {canEditName && <TextField
                        fullWidth
                        label="Tag Name"
                        value={this.state.name}
                        onChange={e => this.setState({ name: e.target.value })}
                    />}
                    {canEditValue && <AutoSuggest
                        label={this.props.current.tagType
                            && this.props.current.tagType.cardTypeReferenceName
                            ? this.props.current.tagType.cardTypeReferenceName
                            : 'Tag Value'}
                        value={this.state.value}
                        getSuggestions={value => CardList.getCardSuggestions(tagType.cardTypeReferenceName, value)}
                        handleChange={(e, value) => this.handleTagValueChange(value)}
                    />}
                    {canEditQuantity && <TextField
                        fullWidth
                        label="Quantity"
                        type="number"
                        value={this.state.quantity}
                        onChange={e => this.setState({ quantity: e.target.value })}
                    />}
                    {canEditUnit && <TextField
                        fullWidth
                        label="Unit"
                        value={this.state.unit}
                        onChange={e => this.setState({ unit: e.target.value })}
                    />}
                    {canEditAmount && <TextField
                        fullWidth
                        label="Amount"
                        type="number"
                        value={this.state.amount}
                        onChange={e => this.setState({ amount: e.target.value })}
                    />}
                    {canEditFunction && <TextField
                        fullWidth
                        label="Function"
                        value={this.state.func}
                        onChange={e => this.setState({ func: e.target.value })}
                    />}
                    {canEditSource && <AutoSuggest
                        label={tagType.sourceCardTypeReferenceName || 'Source'}
                        value={this.state.source}
                        getSuggestions={
                            value => CardList.getCardSuggestions(tagType.sourceCardTypeReferenceName, value)
                        }
                        handleChange={(e, source) => this.setState({ source })}
                    />}
                    {canEditTarget && <AutoSuggest
                        label={tagType.targetCardTypeReferenceName || 'Target'}
                        value={this.state.target}
                        getSuggestions={
                            value => CardList.getCardSuggestions(tagType.targetCardTypeReferenceName, value)
                        }
                        handleChange={(e, target) => this.setState({ target })}
                    />}
                </DialogContent>
                <DialogActions>
                    {/* <Button onClick={() => this.props.cancel()}>Cancel</Button> */}
                    <Button
                        onClick={(e) => {
                            this.props.success(
                                this.props.actionName,
                                {
                                    id: shortid.generate(),
                                    name: this.state.name || `_${shortid.generate()}`,
                                    value: this.state.value,
                                    quantity: Number(this.state.quantity),
                                    unit: this.state.unit,
                                    amount: Number(this.state.amount),
                                    func: this.state.func,
                                    source: this.state.source,
                                    target: this.state.target,
                                    typeId: this.state.typeId
                                });
                        }}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Fragment>
        );
    }
}
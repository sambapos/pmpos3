import * as React from 'react';
import * as shortid from 'shortid';
import AutoSuggest from '../../../../components/AutoSuggest';
import { TextField, DialogContent, DialogActions, Button } from 'material-ui';
import { CardTagRecord, TagTypeRecord } from 'pmpos-models';
import { CardList } from 'pmpos-modules';

interface TagEditorProps {
    tag: CardTagRecord;
    tagType: TagTypeRecord;
    onSubmit: (data: any) => void;
}

interface TagEditorState {
    name: string; value: string; quantity: string; unit: string;
    amount: string; func: string;
    source: string; target: string; typeId: string;
}

export default class TagEditor extends React.Component<TagEditorProps, TagEditorState> {

    constructor(props: TagEditorProps) {
        super(props);
        this.state = this.getState(props);
    }

    getState = (props: TagEditorProps): TagEditorState => {
        let { tagType, tag } = props;
        return {
            typeId: tagType.id,
            name: tag.name || tagType.tagName || tagType.cardTypeReferenceName,
            value: tag.value || tagType.defaultValue,
            quantity: String(tag.quantity !== 0 ? tag.quantity : tagType.defaultQuantity),
            unit: tag.unit || tagType.defaultUnit,
            amount: String(tag.amount !== 0 ? tag.amount : tagType.defaultAmount),
            func: tag.func || tagType.defaultFunction,
            source: tag.source || tagType.defaultSource,
            target: tag.target || tagType.defaultTarget
        };
    }

    handleTagValueChange(value: string) {
        this.setState({ value });
        if (this.props.tagType.cardTypeReferenceName) {
            let card = CardList.getCardByName(this.props.tagType.cardTypeReferenceName, value);
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
        let canEditName = Boolean(
            !this.props.tag.name && !this.props.tagType.id
        );
        let canEditValue = !this.props.tagType.id || this.props.tagType.showValue;
        let canEditQuantity = !this.props.tagType.id || this.props.tagType.showQuantity;
        let canEditUnit = !this.props.tagType.id || this.props.tagType.showUnit;
        let canEditAmount = !this.props.tagType.id || this.props.tagType.showAmount;
        let canEditSource = !this.props.tagType.id || this.props.tagType.showSource;
        let canEditTarget = !this.props.tagType.id || this.props.tagType.showTarget;
        let canEditFunction = !this.props.tagType.id || this.props.tagType.showFunction;

        return (<>
            <DialogContent>
                {canEditName && <TextField
                    fullWidth
                    label="Tag Name"
                    value={this.state.name}
                    onChange={e => this.setState({ name: e.target.value })}
                />}
                {canEditValue && <AutoSuggest
                    label={this.props.tagType
                        && this.props.tagType.tagName
                        ? this.props.tagType.tagName
                        : 'Tag Value'}
                    value={this.state.value}
                    getSuggestions={value =>
                        CardList.getCardSuggestions(this.props.tagType.cardTypeReferenceName, value)}
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
                    label={this.props.tagType.sourceCardTypeReferenceName || 'Source'}
                    value={this.state.source}
                    getSuggestions={
                        value => CardList.getCardSuggestions(this.props.tagType.sourceCardTypeReferenceName, value)
                    }
                    handleChange={(e, source) => this.setState({ source })}
                />}
                {canEditTarget && <AutoSuggest
                    label={this.props.tagType.targetCardTypeReferenceName || 'Target'}
                    value={this.state.target}
                    getSuggestions={
                        value => CardList.getCardSuggestions(this.props.tagType.targetCardTypeReferenceName, value)
                    }
                    handleChange={(e, target) => this.setState({ target })}
                />}
            </DialogContent>
            <DialogActions>
                {/* <Button onClick={() => this.props.cancel()}>Cancel</Button> */}
                <Button
                    onClick={(e) => this.props.onSubmit({
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
                    })}
                >
                    Submit
                </Button>
            </DialogActions>
        </>);
    }
}
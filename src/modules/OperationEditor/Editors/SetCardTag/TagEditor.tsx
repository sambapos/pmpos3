import * as React from 'react';
import * as shortid from 'shortid';
import AutoSuggest from '../../../../components/AutoSuggest';
import { TextField, DialogContent, DialogActions, Button } from '@material-ui/core';
import { CardTagRecord, TagTypeRecord, CardManager } from 'pmpos-core';
import DateTimePicker from 'material-ui-pickers/DateTimePicker';
import { Moment } from 'moment';
import MaskedTextInput from '../../../../components/MaskedTextInput';

interface ITagEditorProps {
    tag: CardTagRecord;
    tagType: TagTypeRecord;
    onSubmit: (data: any) => void;
}

interface ITagEditorState {
    name: string; category: string; value: string; quantity: string; unit: string;
    amount: string; func: string; validUntil: number | null;
    source: string; target: string; typeId: string;
}

export default class TagEditor extends React.Component<ITagEditorProps, ITagEditorState> {

    constructor(props: ITagEditorProps) {
        super(props);
        this.state = this.getState(props);
    }

    public render() {
        const canEditName = Boolean(
            !this.props.tag.name && !this.props.tagType.id
        );
        const canEditCategory = !this.props.tagType.id || this.props.tagType.showCategory;
        const canEditValue = !this.props.tagType.id || this.props.tagType.showValue;
        const canEditQuantity = !this.props.tagType.id || this.props.tagType.showQuantity;
        const canEditUnit = !this.props.tagType.id || this.props.tagType.showUnit;
        const canEditAmount = !this.props.tagType.id || this.props.tagType.showAmount;
        const canEditSource = !this.props.tagType.id || this.props.tagType.showSource;
        const canEditTarget = !this.props.tagType.id || this.props.tagType.showTarget;
        const canEditFunction = !this.props.tagType.id || this.props.tagType.showFunction;
        const canEditValidUntil = !this.props.tagType.id || this.props.tagType.showValidUntil;
        return (<>
            <DialogContent>
                {canEditName && <TextField
                    fullWidth
                    label="Tag Name"
                    value={this.state.name}
                    onChange={e => this.setState({ name: e.target.value })}
                />}
                {canEditValue && this.getValueEditor()}
                {canEditCategory && <TextField
                    fullWidth
                    label="Tag Category"
                    value={this.state.category}
                    onChange={e => this.setState({ category: e.target.value })}
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
                        value => CardManager.getCardSuggestions(this.props.tagType.sourceCardTypeReferenceName, value)
                    }
                    handleChange={(e, source) => this.setState({ source })}
                />}
                {canEditTarget && <AutoSuggest
                    label={this.props.tagType.targetCardTypeReferenceName || 'Target'}
                    value={this.state.target}
                    getSuggestions={
                        value => CardManager.getCardSuggestions(this.props.tagType.targetCardTypeReferenceName, value)
                    }
                    handleChange={(e, target) => this.setState({ target })}
                />}
                {canEditValidUntil && <DateTimePicker
                    label='Valid Until'
                    fullWidth
                    clearable
                    value={this.state.validUntil}
                    onChange={(x: Moment) => this.setState({ validUntil: x ? x.toDate().getTime() : null })}
                />}
            </DialogContent>
            <DialogActions>
                {/* <Button onClick={() => this.props.cancel()}>Cancel</Button> */}
                <Button
                    onClick={(e) => this.props.onSubmit({
                        id: shortid.generate(),
                        name: this.state.name || `_${shortid.generate()}`,
                        category: this.state.category,
                        value: this.state.value,
                        quantity: Number(this.state.quantity),
                        unit: this.state.unit,
                        amount: Number(this.state.amount),
                        func: this.state.func,
                        source: this.state.source,
                        target: this.state.target,
                        typeId: this.state.typeId,
                        validUntil: this.state.validUntil
                    })}
                >
                    Submit
                </Button>
            </DialogActions>
        </>);
    }

    private getState = (props: ITagEditorProps): ITagEditorState => {
        const { tagType, tag } = props;
        return {
            typeId: tagType.id,
            name: tag.name || tagType.tagName || tagType.cardTypeReferenceName,
            category: tag.category || tagType.defaultCategory,
            value: tag.value || tagType.defaultValue,
            quantity: tag.quantity !== 0 ? String(tag.quantity) : this.getNumberStr(tagType.defaultQuantity),
            unit: tag.unit || tagType.defaultUnit,
            amount: tag.amount !== 0 ? String(tag.amount) : this.getNumberStr(tagType.defaultAmount),
            func: tag.func || tagType.defaultFunction,
            source: tag.source || tagType.defaultSource,
            target: tag.target || tagType.defaultTarget,
            validUntil: tag.validUntil || tagType.generateValidUntil() || null
        };
    }

    private getValueEditor() {
        if (this.props.tagType && this.props.tagType.mask) {
            return <MaskedTextInput
                mask={this.props.tagType.realMask}
                label={this.props.tagType
                    && this.props.tagType.tagName
                    ? this.props.tagType.tagName
                    : 'Tag Value'}
                value={this.state.value}
                onChange={value => this.handleTagValueChange(value)}
            />
        }
        return <AutoSuggest
            label={this.props.tagType
                && this.props.tagType.tagName
                ? this.props.tagType.tagName
                : 'Tag Value'}
            value={this.state.value}
            getSuggestions={value =>
                CardManager.getCardSuggestions(this.props.tagType.cardTypeReferenceName, value)}
            handleChange={(e, value) => this.handleTagValueChange(value)}
        />
    }

    private handleTagValueChange(value: string) {
        this.setState({ value });
        if (this.props.tagType.cardTypeReferenceName) {
            const card = CardManager.getCardByName(this.props.tagType.cardTypeReferenceName, value);
            if (card) {
                if (Number(this.state.amount) === 0) {
                    let price = card.getTagValue('Amount', '');
                    if (!price) { price = card.getTagValue('Price', '') }
                    this.setState({ amount: String(price) });
                }
                if (!this.state.source) {
                    this.setState({ source: String(card.getTagValue('Source', '')) });
                }
                if (!this.state.target) {
                    this.setState({ target: String(card.getTagValue('Target', '')) });
                }
            }
        }
    }

    private getNumberStr(value): string {
        return value !== 0 ? String(value) : '';
    }
}
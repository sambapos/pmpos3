import * as React from 'react';
import { TextField, Button, DialogContent, DialogTitle, DialogActions } from 'material-ui';
import * as shortid from 'shortid';
import AutoSuggest from '../../../../components/AutoSuggest';
import CardList from '../../../CardList';
import { CardTagRecord } from '../../../../models/CardTag';
import { Fragment } from 'react';
import { TagTypeRecord } from '../../../../models/TagType';

export default class extends React.Component<
    {
        success: (actionType: string, data: any) => void,
        cancel: () => void,
        actionName: string,
        current: { tagType: TagTypeRecord, tag: CardTagRecord }
    },
    {
        name: string, value: string, quantity: string, unit: string,
        amount: string, rate: string, source: string, target: string,
        typeId: string
    }> {
    constructor(props: any) {
        super(props);
        this.state = {
            name: '', value: '', quantity: '', unit: '',
            amount: '', rate: '', source: '', target: '',
            typeId: ''
        };
    }
    componentDidMount() {
        if (this.props.current && this.props.current.tag) {
            this.setState({
                name: this.props.current.tag.name,
                value: this.props.current.tag.value,
                quantity: String(this.props.current.tag.quantity),
                unit: this.props.current.tag.unit,
                amount: String(this.props.current.tag.amount),
                rate: String(this.props.current.tag.rate),
                source: this.props.current.tag.source,
                target: this.props.current.tag.target
            });
        }
        if (this.props.current && this.props.current.tagType) {
            this.setState({
                typeId: this.props.current.tagType.id
            });
            if (!this.props.current.tag.name) {
                this.setState({
                    name: this.props.current.tagType.cardTypeReferenceName
                });
            }
        }
    }

    render() {
        let tagType = this.props.current.tagType;
        let canEditName = Boolean(
            !this.props.current.tag.name && !tagType.id
        );
        let canEditQuantity = !tagType.id || tagType.showQuantity;
        let canEditUnit = !tagType.id || tagType.showUnit;
        let canEditAmount = !tagType.id || tagType.showAmount;
        let canEditRate = !tagType.id || tagType.showRate;
        let canEditSource = !tagType.id || tagType.sourceCardTypeReferenceName;
        let canEditTarget = !tagType.id || tagType.targetCardTypeReferenceName;

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
                    <AutoSuggest
                        label="Tag Value"
                        value={this.props.current ? this.props.current.tag.value || '' : ''}
                        getSuggestions={value => CardList.getCardSuggestions(tagType.cardTypeReferenceName, value)}
                        handleChange={(e, value) => this.setState({ value })}
                    />
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
                    {canEditRate && <TextField
                        fullWidth
                        label="Rate"
                        type="number"
                        value={this.state.rate}
                        onChange={e => this.setState({ rate: e.target.value })}
                    />}
                    {canEditSource && <AutoSuggest
                        label={tagType.sourceCardTypeReferenceName || 'Source'}
                        value={this.props.current.tag.source}
                        getSuggestions={
                            value => CardList.getCardSuggestions(tagType.sourceCardTypeReferenceName, value)
                        }
                        handleChange={(e, source) => this.setState({ source })}
                    />}
                    {canEditTarget && <AutoSuggest
                        label={tagType.targetCardTypeReferenceName || 'Target'}
                        value={this.props.current.tag.target}
                        getSuggestions={
                            value => CardList.getCardSuggestions(tagType.targetCardTypeReferenceName, value)
                        }
                        handleChange={(e, target) => this.setState({ target })}
                    />}
                    {/* <TextField
                        fullWidth
                        label="Source"
                        value={this.state.source}
                        onChange={e => this.setState({ source: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        label="Target"
                        value={this.state.target}
                        onChange={e => this.setState({ target: e.target.value })}
                    /> */}
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
                                    rate: Number(this.state.rate),
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
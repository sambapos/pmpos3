import * as React from 'react';
import { connect } from 'react-redux';
import * as ConfigStore from '../../store/Config';
import { RouteComponentProps } from 'react-router';
import { WithStyles, TextField, Paper } from '@material-ui/core';
import decorate, { IStyle } from './style';
import { IApplicationState } from '../../store/index';
import TopBar from '../TopBar';
import InputCheckBox from './InputCheckBox';
import { TagTypeRecord } from 'pmpos-core';

type PageProps =
    {
        isLoading: boolean
        tagType: TagTypeRecord
    }
    & WithStyles<keyof IStyle>
    & typeof ConfigStore.actionCreators
    & RouteComponentProps<{ id?: string }>;

interface IPageState {
    name: string;
    tagName: string;
    cardTypeReferenceName: string;
    showValue: boolean;
    showCategory: boolean;
    showQuantity: boolean;
    showUnit: boolean;
    showAmount: boolean;
    showSource: boolean;
    showTarget: boolean;
    showFunction: boolean;
    showValidUntil: boolean;
    sourceCardTypeReferenceName: string;
    targetCardTypeReferenceName: string;
    displayFormat: string;
    icon: string;
    mask: string;
    defaultValue: string;
    defaultCategory: string;
    defaultFunction: string;
    defaultQuantity: string;
    defaultUnit: string;
    defaultAmount: string;
    defaultSource: string;
    defaultTarget: string;
    defaultValidUntil: string;
}

export class TagTypePage extends React.Component<PageProps, IPageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            name: '',
            tagName: '',
            cardTypeReferenceName: '',
            showValue: true,
            showCategory: false,
            showQuantity: true,
            showUnit: true,
            showAmount: true,
            showSource: true,
            showTarget: true,
            showFunction: false,
            showValidUntil: false,
            sourceCardTypeReferenceName: '',
            targetCardTypeReferenceName: '',
            defaultValue: '',
            defaultCategory: '',
            displayFormat: '',
            icon: '',
            mask: '',
            defaultFunction: '',
            defaultQuantity: '',
            defaultUnit: '',
            defaultAmount: '',
            defaultSource: '',
            defaultTarget: '',
            defaultValidUntil: ''
        };
    }

    public componentWillReceiveProps(props: PageProps) {
        if (!props.isLoading && props.tagType !== this.props.tagType && props.tagType.id) {
            this.setState({
                name: props.tagType.name,
                tagName: props.tagType.tagName,
                cardTypeReferenceName: props.tagType.cardTypeReferenceName,
                showValue: props.tagType.showValue,
                showCategory: props.tagType.showCategory,
                showQuantity: props.tagType.showQuantity,
                showUnit: props.tagType.showUnit,
                showAmount: props.tagType.showAmount,
                showSource: props.tagType.showSource,
                showTarget: props.tagType.showTarget,
                showFunction: props.tagType.showFunction,
                showValidUntil: props.tagType.showValidUntil,
                sourceCardTypeReferenceName: props.tagType.sourceCardTypeReferenceName,
                targetCardTypeReferenceName: props.tagType.targetCardTypeReferenceName,
                displayFormat: props.tagType.displayFormat,
                icon: props.tagType.icon,
                mask: props.tagType.mask,
                defaultValue: props.tagType.defaultValue,
                defaultCategory: props.tagType.defaultCategory,
                defaultFunction: props.tagType.defaultFunction,
                defaultQuantity: props.tagType.defaultQuantity !== 0
                    ? String(props.tagType.defaultQuantity)
                    : '',
                defaultUnit: props.tagType.defaultUnit,
                defaultAmount: props.tagType.defaultAmount !== 0
                    ? String(props.tagType.defaultAmount)
                    : '',
                defaultSource: props.tagType.defaultSource,
                defaultTarget: props.tagType.defaultTarget,
                defaultValidUntil: props.tagType.defaultValidUntil
            });
        }
    }

    public componentWillMount() {
        if (!this.props.isLoading && this.props.tagType) {
            this.setState({
                name: this.props.tagType.name,
                tagName: this.props.tagType.tagName,
                cardTypeReferenceName: this.props.tagType.cardTypeReferenceName,
                showValue: this.props.tagType.showValue,
                showCategory: this.props.tagType.showCategory,
                showQuantity: this.props.tagType.showQuantity,
                showUnit: this.props.tagType.showUnit,
                showAmount: this.props.tagType.showAmount,
                showSource: this.props.tagType.showSource,
                showTarget: this.props.tagType.showTarget,
                showFunction: this.props.tagType.showFunction,
                showValidUntil: this.props.tagType.showValidUntil,
                sourceCardTypeReferenceName: this.props.tagType.sourceCardTypeReferenceName,
                targetCardTypeReferenceName: this.props.tagType.targetCardTypeReferenceName,
                displayFormat: this.props.tagType.displayFormat,
                icon: this.props.tagType.icon,
                mask: this.props.tagType.mask,
                defaultValue: this.props.tagType.defaultValue,
                defaultCategory: this.props.tagType.defaultCategory,
                defaultFunction: this.props.tagType.defaultFunction,
                defaultQuantity: this.props.tagType.defaultQuantity !== 0
                    ? String(this.props.tagType.defaultQuantity)
                    : '',
                defaultUnit: this.props.tagType.defaultUnit,
                defaultAmount: this.props.tagType.defaultAmount !== 0
                    ? String(this.props.tagType.defaultAmount)
                    : '',
                defaultSource: this.props.tagType.defaultSource,
                defaultTarget: this.props.tagType.defaultTarget,
                defaultValidUntil: this.props.tagType.defaultValidUntil
            });
        }
    }

    public render() {
        if (this.props.isLoading || !this.props.tagType) { return <div>Loading</div>; }
        return (
            <div className={this.props.classes.root}>
                <TopBar
                    title={this.getTitle()}
                    menuCommand={{ icon: 'close', onClick: () => { this.props.history.goBack(); } }}
                    secondaryCommands={[
                        {
                            icon: 'delete',
                            menuItems: [{
                                icon: 'Confirm',
                                onClick: () => {
                                    this.props.deleteTagType(this.props.tagType.id);
                                    this.props.history.goBack();
                                }
                            }]
                        },
                        {
                            icon: 'check', onClick: () => {
                                this.props.saveTagType(new TagTypeRecord({
                                    id: this.props.tagType.id,
                                    name: this.state.name,
                                    tagName: this.state.tagName,
                                    cardTypeReferenceName: this.state.cardTypeReferenceName,
                                    showValue: this.state.showValue,
                                    showCategory: this.state.showCategory,
                                    showQuantity: this.state.showQuantity,
                                    showUnit: this.state.showUnit,
                                    showAmount: this.state.showAmount,
                                    showSource: this.state.showSource,
                                    showTarget: this.state.showTarget,
                                    showFunction: this.state.showFunction,
                                    showValidUntil: this.state.showValidUntil,
                                    sourceCardTypeReferenceName: this.state.sourceCardTypeReferenceName,
                                    targetCardTypeReferenceName: this.state.targetCardTypeReferenceName,
                                    displayFormat: this.state.displayFormat,
                                    icon: this.state.icon,
                                    mask: this.state.mask,
                                    defaultValue: this.state.defaultValue,
                                    defaultCategory: this.state.defaultCategory,
                                    defaultFunction: this.state.defaultFunction,
                                    defaultQuantity: Number(this.state.defaultQuantity),
                                    defaultUnit: this.state.defaultUnit,
                                    defaultAmount: Number(this.state.defaultAmount),
                                    defaultSource: this.state.defaultSource,
                                    defaultTarget: this.state.defaultTarget,
                                    defaultValidUntil: this.state.defaultValidUntil
                                }));
                                this.props.history.goBack();
                            }
                        }
                    ]}
                />
                <Paper className={this.props.classes.content}>
                    <TextField
                        required
                        fullWidth
                        label="Tag Type Name"
                        value={this.state.name}
                        onChange={(e) => this.setState({
                            name: e.target.value
                        })}
                    />
                    <TextField
                        fullWidth
                        label="Tag Name"
                        value={this.state.tagName}
                        onChange={(e) => this.setState({
                            tagName: e.target.value
                        })}
                    />
                    <TextField
                        fullWidth
                        label="Card Type Reference Name"
                        value={this.state.cardTypeReferenceName}
                        onChange={(e) => this.setState({
                            cardTypeReferenceName: e.target.value
                        })}
                    />
                    <InputCheckBox
                        label="Default Value"
                        value={this.state.defaultValue}
                        onChange={e => this.setState({ defaultValue: e.target.value })}
                        onCheckboxClick={() => this.setState({ showValue: !this.state.showValue })}
                        isChecked={this.state.showValue}
                    />
                    <InputCheckBox
                        label="Default Category"
                        value={this.state.defaultCategory}
                        onChange={e => this.setState({ defaultCategory: e.target.value })}
                        onCheckboxClick={() => this.setState({ showCategory: !this.state.showCategory })}
                        isChecked={this.state.showCategory}
                    />
                    <div className={this.props.classes.grouper}>
                        <InputCheckBox
                            label="Default Quantity"
                            type="number"
                            value={this.state.defaultQuantity}
                            onChange={e => this.setState({ defaultQuantity: e.target.value })}
                            onCheckboxClick={() => this.setState({ showQuantity: !this.state.showQuantity })}
                            isChecked={this.state.showQuantity}
                        />
                        <div className={this.props.classes.spacer} />
                        <InputCheckBox
                            label="Default Unit"
                            value={this.state.defaultUnit}
                            onChange={e => this.setState({ defaultUnit: e.target.value })}
                            onCheckboxClick={() => this.setState({ showUnit: !this.state.showUnit })}
                            isChecked={this.state.showUnit}
                        />
                    </div>
                    <div className={this.props.classes.grouper}>
                        <InputCheckBox
                            label="Default Amount"
                            type="number"
                            value={this.state.defaultAmount}
                            onChange={e => this.setState({ defaultAmount: e.target.value })}
                            onCheckboxClick={() => this.setState({ showAmount: !this.state.showAmount })}
                            isChecked={this.state.showAmount}
                        />
                        <div className={this.props.classes.spacer} />
                        <InputCheckBox
                            label="Default Function"
                            value={this.state.defaultFunction}
                            onChange={e => this.setState({ defaultFunction: e.target.value })}
                            onCheckboxClick={() => this.setState({ showFunction: !this.state.showFunction })}
                            isChecked={this.state.showFunction}
                        />
                    </div>
                    <div className={this.props.classes.grouper}>
                        <TextField
                            fullWidth
                            label="Source Card Type Reference Name"
                            value={this.state.sourceCardTypeReferenceName}
                            onChange={(e) => this.setState({
                                sourceCardTypeReferenceName: e.target.value
                            })}
                        />
                        <div className={this.props.classes.spacer} />
                        <TextField
                            fullWidth
                            label="Target Card Type Reference Name"
                            value={this.state.targetCardTypeReferenceName}
                            onChange={(e) => this.setState({
                                targetCardTypeReferenceName: e.target.value
                            })}
                        />
                    </div>
                    <div className={this.props.classes.grouper}>
                        <InputCheckBox
                            label="Default Source"
                            value={this.state.defaultSource}
                            onChange={e => this.setState({ defaultSource: e.target.value })}
                            onCheckboxClick={() => this.setState({ showSource: !this.state.showSource })}
                            isChecked={this.state.showSource}
                        />
                        <div className={this.props.classes.spacer} />
                        <InputCheckBox
                            label="Default Target"
                            value={this.state.defaultTarget}
                            onChange={e => this.setState({ defaultTarget: e.target.value })}
                            onCheckboxClick={() => this.setState({ showTarget: !this.state.showTarget })}
                            isChecked={this.state.showTarget}
                        />
                    </div>
                    <InputCheckBox
                        label="Default Valid Until"
                        value={this.state.defaultValidUntil}
                        onChange={e => this.setState({ defaultValidUntil: e.target.value })}
                        onCheckboxClick={() => this.setState({ showValidUntil: !this.state.showValidUntil })}
                        isChecked={this.state.showValidUntil}
                    />
                    <TextField
                        fullWidth
                        inputProps={{ className: this.props.classes.fixedEdit }}
                        multiline
                        rowsMax={12}
                        label="Display Format"
                        value={this.state.displayFormat}
                        onChange={(e) => this.setState({
                            displayFormat: e.target.value
                        })}
                    />
                    <TextField
                        fullWidth
                        label="Icon"
                        value={this.state.icon}
                        onChange={(e) => this.setState({
                            icon: e.target.value
                        })}
                    />
                    <TextField
                        fullWidth
                        label="Mask"
                        value={this.state.mask}
                        onChange={(e) => this.setState({
                            mask: e.target.value
                        })}
                    />
                </Paper >
            </div>
        );
    }

    private getTitle() {
        return this.props.tagType.name ? `Tag Type (${this.props.tagType.name})` : 'New Tag Type';
    }
}

const mapStateToProps = (state: IApplicationState) => ({
    tagType: state.config.currentTagType,
    isLoading: state.config.isLoading
});

export default decorate(connect(
    mapStateToProps,
    ConfigStore.actionCreators
)(TagTypePage));
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
    showQuantity: boolean;
    showUnit: boolean;
    showPrice: boolean;
    showSource: boolean;
    showTarget: boolean;
    showFunction: boolean;
    sourceCardTypeReferenceName: string;
    targetCardTypeReferenceName: string;
    displayFormat: string;
    icon: string;
    defaultValue: string;
    defaultFunction: string;
    defaultQuantity: string;
    defaultUnit: string;
    defaultPrice: string;
    defaultSource: string;
    defaultTarget: string;
}

export class TagTypePage extends React.Component<PageProps, IPageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            name: '',
            tagName: '',
            cardTypeReferenceName: '',
            showValue: true,
            showQuantity: true,
            showUnit: true,
            showPrice: true,
            showSource: true,
            showTarget: true,
            showFunction: false,
            sourceCardTypeReferenceName: '',
            targetCardTypeReferenceName: '',
            defaultValue: '',
            displayFormat: '',
            icon: '',
            defaultFunction: '',
            defaultQuantity: '',
            defaultUnit: '',
            defaultPrice: '',
            defaultSource: '',
            defaultTarget: ''
        };
    }

    public componentWillReceiveProps(props: PageProps) {
        if (!props.isLoading && props.tagType !== this.props.tagType && props.tagType.id) {
            this.setState({
                name: props.tagType.name,
                tagName: props.tagType.tagName,
                cardTypeReferenceName: props.tagType.cardTypeReferenceName,
                showValue: props.tagType.showValue,
                showQuantity: props.tagType.showQuantity,
                showUnit: props.tagType.showUnit,
                showPrice: props.tagType.showPrice,
                showSource: props.tagType.showSource,
                showTarget: props.tagType.showTarget,
                showFunction: props.tagType.showFunction,
                sourceCardTypeReferenceName: props.tagType.sourceCardTypeReferenceName,
                targetCardTypeReferenceName: props.tagType.targetCardTypeReferenceName,
                displayFormat: props.tagType.displayFormat,
                icon: props.tagType.icon,
                defaultValue: props.tagType.defaultValue,
                defaultFunction: props.tagType.defaultFunction,
                defaultQuantity: props.tagType.defaultQuantity !== 0
                    ? String(props.tagType.defaultQuantity)
                    : '',
                defaultUnit: props.tagType.defaultUnit,
                defaultPrice: props.tagType.defaultPrice !== 0
                    ? String(props.tagType.defaultPrice)
                    : '',
                defaultSource: props.tagType.defaultSource,
                defaultTarget: props.tagType.defaultTarget
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
                showQuantity: this.props.tagType.showQuantity,
                showUnit: this.props.tagType.showUnit,
                showPrice: this.props.tagType.showPrice,
                showSource: this.props.tagType.showSource,
                showTarget: this.props.tagType.showTarget,
                showFunction: this.props.tagType.showFunction,
                sourceCardTypeReferenceName: this.props.tagType.sourceCardTypeReferenceName,
                targetCardTypeReferenceName: this.props.tagType.targetCardTypeReferenceName,
                displayFormat: this.props.tagType.displayFormat,
                icon: this.props.tagType.icon,
                defaultValue: this.props.tagType.defaultValue,
                defaultFunction: this.props.tagType.defaultFunction,
                defaultQuantity: this.props.tagType.defaultQuantity !== 0
                    ? String(this.props.tagType.defaultQuantity)
                    : '',
                defaultUnit: this.props.tagType.defaultUnit,
                defaultPrice: this.props.tagType.defaultPrice !== 0
                    ? String(this.props.tagType.defaultPrice)
                    : '',
                defaultSource: this.props.tagType.defaultSource,
                defaultTarget: this.props.tagType.defaultTarget
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
                                    showQuantity: this.state.showQuantity,
                                    showUnit: this.state.showUnit,
                                    showPrice: this.state.showPrice,
                                    showSource: this.state.showSource,
                                    showTarget: this.state.showTarget,
                                    showFunction: this.state.showFunction,
                                    sourceCardTypeReferenceName: this.state.sourceCardTypeReferenceName,
                                    targetCardTypeReferenceName: this.state.targetCardTypeReferenceName,
                                    displayFormat: this.state.displayFormat,
                                    icon: this.state.icon,
                                    defaultValue: this.state.defaultValue,
                                    defaultFunction: this.state.defaultFunction,
                                    defaultQuantity: Number(this.state.defaultQuantity),
                                    defaultUnit: this.state.defaultUnit,
                                    defaultPrice: Number(this.state.defaultPrice),
                                    defaultSource: this.state.defaultSource,
                                    defaultTarget: this.state.defaultTarget
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
                    <InputCheckBox
                        label="Default Price"
                        type="number"
                        value={this.state.defaultPrice}
                        onChange={e => this.setState({ defaultPrice: e.target.value })}
                        onCheckboxClick={() => this.setState({ showPrice: !this.state.showPrice })}
                        isChecked={this.state.showPrice}
                    />
                    <InputCheckBox
                        label="Default Function"
                        value={this.state.defaultFunction}
                        onChange={e => this.setState({ defaultFunction: e.target.value })}
                        onCheckboxClick={() => this.setState({ showFunction: !this.state.showFunction })}
                        isChecked={this.state.showFunction}
                    />
                    <TextField
                        fullWidth
                        label="Source Card Type Reference Name"
                        value={this.state.sourceCardTypeReferenceName}
                        onChange={(e) => this.setState({
                            sourceCardTypeReferenceName: e.target.value
                        })}
                    />
                    <TextField
                        fullWidth
                        label="Target Card Type Reference Name"
                        value={this.state.targetCardTypeReferenceName}
                        onChange={(e) => this.setState({
                            targetCardTypeReferenceName: e.target.value
                        })}
                    />
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
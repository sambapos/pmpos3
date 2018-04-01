import * as React from 'react';
import { connect } from 'react-redux';
import * as ConfigStore from '../../store/Config';
import { RouteComponentProps } from 'react-router';
import { FormControlLabel, FormGroup, WithStyles, TextField, Paper, Checkbox } from 'material-ui';
import decorate, { Style } from './style';
import { ApplicationState } from '../../store/index';
import TopBar from '../TopBar';
import { TagTypeRecord } from '../../models/TagType';

type PageProps =
    {
        isLoading: boolean
        tagType: TagTypeRecord
    }
    & WithStyles<keyof Style>
    & typeof ConfigStore.actionCreators
    & RouteComponentProps<{ id?: string }>;

interface PageState {
    name: string;
    cardTypeReferenceName: string;
    showQuantity: boolean;
    showUnit: boolean;
    showAmount: boolean;
    showRate: boolean;
    sourceCardTypeReferenceName: string;
    targetCardTypeReferenceName: string;
    displayFormat: string;
}

export class TagTypePage extends React.Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            name: '',
            cardTypeReferenceName: '',
            showQuantity: true,
            showUnit: true,
            showAmount: true,
            showRate: true,
            sourceCardTypeReferenceName: '',
            targetCardTypeReferenceName: '',
            displayFormat: ''
        };
    }

    public componentWillReceiveProps(props: PageProps) {
        if (!props.isLoading) {
            this.setState({
                name: props.tagType.name,
                cardTypeReferenceName: props.tagType.cardTypeReferenceName,
                showQuantity: props.tagType.showQuantity,
                showUnit: props.tagType.showUnit,
                showAmount: props.tagType.showAmount,
                showRate: props.tagType.showRate,
                sourceCardTypeReferenceName: props.tagType.sourceCardTypeReferenceName,
                targetCardTypeReferenceName: props.tagType.targetCardTypeReferenceName,
                displayFormat: props.tagType.displayFormat
            });
        }
    }

    public componentWillMount() {
        if (!this.props.isLoading && this.props.tagType) {
            this.setState({
                name: this.props.tagType.name,
                cardTypeReferenceName: this.props.tagType.cardTypeReferenceName,
                showQuantity: this.props.tagType.showQuantity,
                showUnit: this.props.tagType.showUnit,
                showAmount: this.props.tagType.showAmount,
                showRate: this.props.tagType.showRate,
                sourceCardTypeReferenceName: this.props.tagType.sourceCardTypeReferenceName,
                targetCardTypeReferenceName: this.props.tagType.targetCardTypeReferenceName,
                displayFormat: this.props.tagType.displayFormat
            });
        }
    }

    getTitle() {
        return this.props.tagType.name ? `Tag Type (${this.props.tagType.name})` : 'New Tag Type';
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
                                    cardTypeReferenceName: this.state.cardTypeReferenceName,
                                    showQuantity: this.state.showQuantity,
                                    showUnit: this.state.showUnit,
                                    showAmount: this.state.showAmount,
                                    showRate: this.state.showRate,
                                    sourceCardTypeReferenceName: this.state.sourceCardTypeReferenceName,
                                    targetCardTypeReferenceName: this.state.targetCardTypeReferenceName,
                                    displayFormat: this.state.displayFormat
                                }));
                                this.props.history.goBack();
                            }
                        }
                    ]}
                />
                <Paper className={this.props.classes.content}>
                    <TextField
                        required
                        label="Tag Type Name"
                        value={this.state.name}
                        onChange={(e) => this.setState({
                            name: e.target.value
                        })}
                    />
                    <TextField
                        label="Card Type Reference Name"
                        value={this.state.cardTypeReferenceName}
                        onChange={(e) => this.setState({
                            cardTypeReferenceName: e.target.value
                        })}
                    />
                    <FormGroup row>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.showQuantity}
                                    onChange={e => this.setState({ showQuantity: e.target.checked })}
                                />
                            }
                            label="Show Quantity"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.showUnit}
                                    onChange={e => this.setState({ showUnit: e.target.checked })}
                                />
                            }
                            label="Show Unit"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.showAmount}
                                    onChange={e => this.setState({ showAmount: e.target.checked })}
                                />
                            }
                            label="Show Amount"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.showRate}
                                    onChange={e => this.setState({ showRate: e.target.checked })}
                                />
                            }
                            label="Show Rate"
                        />
                    </FormGroup>
                    <TextField
                        label="Source Card Type Reference Name"
                        value={this.state.sourceCardTypeReferenceName}
                        onChange={(e) => this.setState({
                            sourceCardTypeReferenceName: e.target.value
                        })}
                    />
                    <TextField
                        label="Target Card Type Reference Name"
                        value={this.state.targetCardTypeReferenceName}
                        onChange={(e) => this.setState({
                            targetCardTypeReferenceName: e.target.value
                        })}
                    />
                    <TextField
                        inputProps={{ className: this.props.classes.fixedEdit }}
                        multiline
                        rowsMax={6}
                        label="Display Format"
                        value={this.state.displayFormat}
                        onChange={(e) => this.setState({
                            displayFormat: e.target.value
                        })}
                    />
                </Paper >
            </div>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    tagType: state.config.currentTagType,
    isLoading: state.config.isLoading
});

export default decorate(connect(
    mapStateToProps,
    ConfigStore.actionCreators
)(TagTypePage));
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
            showRate: true
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
                showRate: props.tagType.showRate
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
                showRate: this.props.tagType.showRate
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
                                    showRate: this.state.showRate
                                }));
                                this.props.history.goBack();
                            }
                        }
                    ]}
                />
                <Paper className={this.props.classes.content}>
                    <TextField
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
                    <FormGroup>
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
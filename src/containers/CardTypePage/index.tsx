import * as React from 'react';
import { connect } from 'react-redux';
import * as ConfigStore from '../../store/Config';
import * as ClientStore from '../../store/Client';
import { reorder } from '../../lib/helpers';
import { RouteComponentProps } from 'react-router';
import { CardActions, Typography, WithStyles, TextField, Paper, Button } from 'material-ui';
import * as Extender from '../../lib/Extender';
import decorate, { Style } from './style';
import { ApplicationState } from '../../store/index';
import TopBar from '../TopBar';
import { CardTypeRecord } from '../../models/CardType';
import TagTypeSelectionDialog from './TagTypeSelectionDialog';
import TagList from './TagList';

type PageProps =
    {
        isLoading: boolean
        cardType: CardTypeRecord
    }
    & WithStyles<keyof Style>
    & typeof ConfigStore.actionCreators
    & typeof ClientStore.actionCreators
    & RouteComponentProps<{ id?: string }>;

interface PageState {
    name: string;
    reference: string;
    displayFormat: string;
    commands: string;
    tagTypes: string[];
}

export class CardTypePage extends React.Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            name: '',
            reference: '',
            commands: '',
            displayFormat: '',
            tagTypes: []
        };
    }

    public componentWillReceiveProps(props: PageProps) {
        if (!props.isLoading && props.cardType !== this.props.cardType && props.cardType.id) {
            this.setState({
                name: props.cardType.name,
                reference: props.cardType.reference,
                displayFormat: props.cardType.displayFormat,
                commands: props.cardType.commands.join('\n'),
                tagTypes: props.cardType.tagTypes
            });
        }
    }

    public componentWillMount() {
        if (!this.props.isLoading && this.props.cardType) {
            this.setState({
                name: this.props.cardType.name,
                reference: this.props.cardType.reference,
                displayFormat: this.props.cardType.displayFormat,
                commands: this.props.cardType.commands.join('\n'),
                tagTypes: this.props.cardType.tagTypes
            });
        }
    }

    getTitle() {
        return this.props.cardType.name ? `Card Type (${this.props.cardType.name})` : 'New Card Type';
    }

    showSelectionDialog() {
        let component = (<TagTypeSelectionDialog
            tagTypes={this.state.tagTypes}
            onSubmit={tagTypes => {
                this.setState({ tagTypes });
                this.props.SetModalState(false);
            }}
        />);

        this.props.SetModalComponent(component);
    }

    getTagTypeList() {
        if (this.state.tagTypes.length === 0) {
            return (
                <Typography style={{ padding: 8 }} className={this.props.classes.list}>
                    No tag types selected for {this.props.cardType.name} card type.
                    Click Select Tag Types button to select tag types.
                 </Typography>);
        }
        return (<TagList
            onDragEnd={x => this.onDragEnd(x)}
            tagTypes={this.state.tagTypes}
            classes={this.props.classes}
            onClick={id => {
                if (id) {
                    this.props.history.push(
                        process.env.PUBLIC_URL + '/tagType');
                    this.props.loadTagType(id);
                }
            }}
        />);
    }

    onDragEnd(result: any) {
        if (!result.destination) {
            return;
        }

        let items = reorder(
            this.state.tagTypes,
            result.source.index,
            result.destination.index
        );

        this.setState({
            tagTypes: items
        });
    }

    public render() {
        if (this.props.isLoading || !this.props.cardType) { return <div>Loading</div>; }
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
                                    this.props.deleteCardType(this.props.cardType.id);
                                    this.props.history.goBack();
                                }
                            }]
                        },
                        {
                            icon: 'check', onClick: () => {
                                this.props.saveCardType(new CardTypeRecord({
                                    id: this.props.cardType.id,
                                    name: this.state.name,
                                    reference: this.state.reference,
                                    displayFormat: this.state.displayFormat,
                                    commands: this.state.commands.split('\n'),
                                    tagTypes: this.state.tagTypes
                                }));
                                this.props.history.goBack();
                            }
                        }
                    ]}
                />
                <Paper className={this.props.classes.paper}>
                    <TextField
                        label="Card Type Name"
                        value={this.state.name}
                        onChange={(e) => this.setState({
                            name: e.target.value
                        })}
                    />
                    <TextField
                        label="Reference"
                        value={this.state.reference}
                        onChange={(e) => this.setState({
                            reference: e.target.value
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

                    <TextField
                        inputProps={{ className: this.props.classes.fixedEdit }}
                        multiline
                        rows={3}
                        rowsMax={6}
                        label="Commands"
                        value={this.state.commands}
                        onChange={(e) => this.setState({
                            commands: e.target.value
                        })}
                    />
                </Paper >
                <Paper className={this.props.classes.content}>
                    <Typography variant="title">Tag Types</Typography>
                    {this.getTagTypeList()}
                    <CardActions>
                        <Button
                            color="secondary"
                            style={{ float: 'right' }}
                            onClick={e => this.showSelectionDialog()}
                        >
                            Select Tag Types
                        </Button>
                    </CardActions>
                </Paper>
            </div>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    cardType: state.config.currentCardType,
    isLoading: state.config.isLoading
});

export default decorate(connect(
    mapStateToProps,
    Extender.extend(ClientStore.actionCreators, ConfigStore.actionCreators)
)(CardTypePage));
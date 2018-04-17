import * as React from 'react';
import { connect } from 'react-redux';
import * as ConfigStore from '../../store/Config';
import * as ClientStore from '../../store/Client';
import { RouteComponentProps } from 'react-router';
import { CardActions, Typography, WithStyles, TextField, Paper, Button } from 'material-ui';
import * as Extender from '../../lib/Extender';
import decorate, { Style } from './style';
import { ApplicationState } from '../../store/index';
import TopBar from '../TopBar';
import DraggableItemList from '../../components/DraggableItemList';
import CardList from '../../modules/CardList';
import ItemSelectionDialog from '../../components/ItemSelectionDialog';
import { CardTypeRecord, TagTypeRecord } from 'pmpos-models';

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
    subCardTypes: string[];
}

export class CardTypePage extends React.Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            name: '',
            reference: '',
            commands: '',
            displayFormat: '',
            tagTypes: [],
            subCardTypes: []
        };
    }

    public componentWillReceiveProps(props: PageProps) {
        if (!props.isLoading && props.cardType !== this.props.cardType && props.cardType.id) {
            this.setState({
                name: props.cardType.name,
                reference: props.cardType.reference,
                displayFormat: props.cardType.displayFormat,
                commands: props.cardType.commands.join('\n'),
                tagTypes: props.cardType.tagTypes,
                subCardTypes: props.cardType.subCardTypes
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
                tagTypes: this.props.cardType.tagTypes,
                subCardTypes: this.props.cardType.subCardTypes
            });
        }
    }

    getTitle() {
        return this.props.cardType.name ? `Card Type (${this.props.cardType.name})` : 'New Card Type';
    }

    showTagSelectionDialog() {
        let component = (
            <ItemSelectionDialog
                selectedItems={this.state.tagTypes}
                sourceItems={CardList.tagTypes.valueSeq().toArray()}
                onSubmit={tagTypes => {
                    this.setState({ tagTypes });
                    this.props.SetModalState(false);
                }}
            />);
        this.props.SetModalComponent(component);
    }

    showCardSelectionDialog() {
        let component = (
            <ItemSelectionDialog
                selectedItems={this.state.subCardTypes}
                sourceItems={CardList.cardTypes.valueSeq().toArray()}
                onSubmit={subCardTypes => {
                    this.setState({ subCardTypes });
                    this.props.SetModalState(false);
                }}
            />);
        this.props.SetModalComponent(component);
    }

    getTagTypeList() {
        if (this.state.tagTypes.length === 0) {
            return (
                <Typography className={this.props.classes.subHeader}>
                    No tag types selected for {this.props.cardType.name} card type.
                    Click Select Tag Types button to select tag types.
                 </Typography>);
        }
        let list = this.state.tagTypes
            .filter(tt => CardList.tagTypes.has(tt))
            .map(tt => CardList.tagTypes.get(tt) as TagTypeRecord);
        return (<DraggableItemList
            onDragEnd={items => this.setState({ tagTypes: items.map(i => i.id) })}
            items={list}
            onClick={id => {
                if (id) {
                    this.props.history.push(
                        process.env.PUBLIC_URL + '/tagType');
                    this.props.loadTagType(id);
                }
            }}
        />);
    }

    getSubCardTypeList() {
        if (this.state.subCardTypes.length === 0) {
            return (
                <Typography className={this.props.classes.subHeader}>
                    No sub card types selected for {this.props.cardType.name} card type.
                    Click Select Card Types button to select card types.
                 </Typography>);
        }
        let list = this.state.subCardTypes
            .filter(tt => CardList.cardTypes.has(tt))
            .map(tt => CardList.cardTypes.get(tt) as CardTypeRecord);
        return (<DraggableItemList
            onDragEnd={items => this.setState({ subCardTypes: items.map(i => i.id) })}
            items={list}
        />);
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
                                    tagTypes: this.state.tagTypes,
                                    subCardTypes: this.state.subCardTypes
                                }));
                                this.props.history.goBack();
                            }
                        }
                    ]}
                />
                <div className={this.props.classes.fixedRow}>
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
                </div>
                <div className={this.props.classes.dynamicRow}>
                    <Paper className={this.props.classes.content}>
                        <Typography variant="title">Sub Card Types</Typography>
                        {this.getSubCardTypeList()}
                        <CardActions>
                            <Button
                                color="secondary"
                                style={{ float: 'right' }}
                                onClick={e => this.showCardSelectionDialog()}
                            >
                                Select Card Types
                        </Button>
                        </CardActions>
                    </Paper>
                    <Paper className={this.props.classes.content}>
                        <Typography variant="title">Tag Types</Typography>
                        {this.getTagTypeList()}
                        <CardActions>
                            <Button
                                color="secondary"
                                style={{ float: 'right' }}
                                onClick={e => this.showTagSelectionDialog()}
                            >
                                Select Tag Types
                        </Button>
                        </CardActions>
                    </Paper>
                </div>
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
import * as React from 'react';
import { connect } from 'react-redux';
import * as ConfigStore from '../../store/Config';
import { RouteComponentProps } from 'react-router';
import { WithStyles, TextField, Paper } from 'material-ui';
import decorate, { Style } from './style';
import { ApplicationState } from '../../store/index';
import TopBar from '../TopBar';
import { CardTypeRecord } from '../../models/CardType';

type PageProps =
    {
        isLoading: boolean
        cardType: CardTypeRecord
    }
    & WithStyles<keyof Style>
    & typeof ConfigStore.actionCreators
    & RouteComponentProps<{ id?: string }>;

interface PageState {
    name: string;
    reference: string;
    listDisplayFormat: string;
    cardDisplayFormat: string;
    commands: string;
}

export class CardTypePage extends React.Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            name: '',
            reference: '',
            commands: '',
            listDisplayFormat: '',
            cardDisplayFormat: ''
        };
    }

    public componentWillReceiveProps(props: PageProps) {
        if (!props.isLoading) {
            this.setState({
                name: props.cardType.name,
                reference: props.cardType.reference,
                listDisplayFormat: props.cardType.listDisplayFormat,
                cardDisplayFormat: props.cardType.cardDisplayFormat,
                commands: props.cardType.commands.join('\n')
            });
        }
    }

    public componentWillMount() {
        if (!this.props.isLoading && this.props.cardType) {
            this.setState({
                name: this.props.cardType.name,
                reference: this.props.cardType.reference,
                listDisplayFormat: this.props.cardType.listDisplayFormat,
                cardDisplayFormat: this.props.cardType.cardDisplayFormat,
                commands: this.props.cardType.commands.join('\n')
            });
        }
    }

    getTitle() {
        return this.props.cardType.name ? `Card Type (${this.props.cardType.name})` : 'New Card Type';
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
                                    listDisplayFormat: this.state.listDisplayFormat,
                                    cardDisplayFormat: this.state.cardDisplayFormat,
                                    commands: this.state.commands.split('\n')
                                }));
                                this.props.history.goBack();
                            }
                        }
                    ]}
                />
                <Paper className={this.props.classes.content}>
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
                        label="List Display Format"
                        value={this.state.listDisplayFormat}
                        onChange={(e) => this.setState({
                            listDisplayFormat: e.target.value
                        })}
                    />
                    <TextField
                        inputProps={{ className: this.props.classes.fixedEdit }}
                        multiline
                        rowsMax={6}
                        label="Card Display Format"
                        value={this.state.cardDisplayFormat}
                        onChange={(e) => this.setState({
                            cardDisplayFormat: e.target.value
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
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    cardType: state.config.currentCardType,
    isLoading: state.config.isLoading
});

export default decorate(connect(
    mapStateToProps,
    ConfigStore.actionCreators
)(CardTypePage));
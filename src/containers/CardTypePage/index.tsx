import * as React from 'react';
import { connect } from 'react-redux';
import * as ConfigStore from '../../store/Config';
import { RouteComponentProps } from 'react-router';
import { WithStyles, TextField } from 'material-ui';
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

export class CardTypePage extends React.Component<PageProps, { cardType: CardTypeRecord }> {
    constructor(props: PageProps) {
        super(props);
        this.state = { cardType: new CardTypeRecord() };
    }

    public componentWillReceiveProps(props: PageProps) {
        if (!props.isLoading) {
            this.setState({ cardType: props.cardType });
        }
    }

    public componentWillMount() {
        if (!this.props.isLoading && this.props.cardType) {
            this.setState({ cardType: this.props.cardType });
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
                            icon: 'check', onClick: () => {
                                this.props.saveCardType(this.state.cardType);
                                this.props.history.goBack();
                            }
                        }
                    ]}
                />
                <div className={this.props.classes.content}>
                    <TextField
                        label="Card Type Name"
                        value={this.state.cardType.name}
                        onChange={(e) => this.setState({
                            cardType: this.state.cardType.set('name', e.target.value)
                        })}
                    />

                    <TextField
                        label="Reference"
                        value={this.state.cardType.reference}
                        onChange={(e) => this.setState({
                            cardType: this.state.cardType.set('reference', e.target.value)
                        })}
                    />
                </div >
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
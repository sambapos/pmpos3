import * as React from 'react';
import { connect } from 'react-redux';
import * as DocumentStore from '../../store/Documents';
import { RouteComponentProps } from 'react-router';
import { WithStyles } from 'material-ui';
import decorate, { Style } from './style';
import * as moment from 'moment';
import { ApplicationState } from '../../store/index';
import TopBar from '../TopBar';

export type PageProps =
    DocumentStore.State
    & WithStyles<keyof Style>
    & typeof DocumentStore.actionCreators
    & RouteComponentProps<{ id: string }>;

class DocumentsPage extends React.Component<PageProps, {}> {
    public componentDidMount() {
        this.props.loadDocument(this.props.match.params.id);
    }
    public render() {
        if (!this.props.isInitialized) { return <div>Loading</div>; }
        return (
            <div>
                <TopBar
                    title="Document"
                    menuCommand={{ icon: 'close', onClick: () => { this.props.history.goBack(); } }}
                />
                <p>{this.props.document.id}</p>
                <p>{moment(this.props.document.date).format('LLLL')}</p>
                <button
                    onClick={
                        () => {
                            this.props.addExchange(this.props.document.id);
                        }
                    }
                >Add Exchange
                </button>
                <ul>
                    {
                        this.props.document.exchanges.map(x => {
                            return (<li key={x.id}>{x.id}</li>);
                        })
                    }
                </ul>
            </div>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    document: state.documents.document,
    isInitialized: state.documents.isInitialized
});

export default decorate(connect(
    mapStateToProps,
    DocumentStore.actionCreators
)(DocumentsPage));
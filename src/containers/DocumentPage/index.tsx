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
    {
        isInitialized: boolean,
        document: Map<any, any>
    }
    & WithStyles<keyof Style>
    & typeof DocumentStore.actionCreators
    & RouteComponentProps<{ id: string }>;

class DocumentsPage extends React.Component<PageProps, {}> {
    public componentDidMount() {
        this.props.loadDocument(this.props.match.params.id);
    }
    public render() {
        if (!this.props.isInitialized || !this.props.document) { return <div>Loading</div>; }
        return (
            <div>
                <TopBar
                    title="Document"
                    menuCommand={{ icon: 'close', onClick: () => { this.props.history.goBack(); } }}
                />
                <p>{this.props.document.get('id')}</p>
                <p>{moment(this.props.document.get('date')).format('LLLL')}</p>
                <button
                    onClick={
                        () => {
                            this.props.addExchange(this.props.document.get('id'));
                        }
                    }
                >Add Exchange
                </button>
                <ul>
                    {
                        this.props.document.get('exchanges').map(x => {
                            return (<li key={x.get('id')}>{x.get('id')}</li>);
                        })
                    }
                </ul>
            </div>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    document: state.documents.get('document'),
    isInitialized: state.documents.get('isInitialized')
});

export default decorate(connect(
    mapStateToProps,
    DocumentStore.actionCreators
)(DocumentsPage));
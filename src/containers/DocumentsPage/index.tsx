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
    & RouteComponentProps<{}>;

class DocumentsPage extends React.Component<PageProps, {}> {
    public render() {
        return (
            <div>
                <TopBar title="Documents" />
                <button onClick={() => this.props.addDocument()}>Add Document</button>
                <ul>
                    {
                        this.props.documents.map(document => {
                            return (
                                <li key={document && document.id}>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            if (document) { this.props.history.push('/document/' + document.id); }
                                            e.preventDefault();
                                        }}
                                    >
                                        {document && moment(document.date).format('LLLL')}
                                    </a>
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    documents: state.documents.documents,
    document: state.documents.document
});

export default decorate(connect(
    mapStateToProps,
    DocumentStore.actionCreators
)(DocumentsPage));
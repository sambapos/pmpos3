import * as React from 'react';
import { connect } from 'react-redux';
import * as DocumentStore from '../../store/Documents';
import { RouteComponentProps } from 'react-router';
import { WithStyles } from 'material-ui';
import decorate, { Style } from './style';
import * as moment from 'moment';
import { ApplicationState } from '../../store/index';

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
                <h3>Document</h3>
                <p>{this.props.document.id}</p>
                <p>{moment(this.props.document.date).format('LLLL')}</p>
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
import * as React from 'react';
import { connect } from 'react-redux';
import * as DocumentStore from '../../store/Documents';
import { RouteComponentProps } from 'react-router';
import { List } from 'immutable';
import { WithStyles } from 'material-ui';
import decorate, { Style } from './style';

export type PageProps =
    { documents: List<DocumentStore.DocumentRecord> }
    & WithStyles<keyof Style>
    & typeof DocumentStore.actionCreators
    & RouteComponentProps<{}>;

class DocumentsPage extends React.Component<PageProps, {}> {
    public render() {
        return (
            <h3>
                Documents
            </h3>
        );
    }
}

const mapStateToProps = state => ({ documents: state.documents });

export default decorate(connect(
    mapStateToProps,
    DocumentStore.actionCreators
)(DocumentsPage));
import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as ClientStore from '../../store/Client';
import { PageProps } from '../PageProps';

class DashboardPage extends React.Component<PageProps, {}> {
    public render() {
        return (
            <h3>
                Dashboard
            </h3>
        );
    }
}

export default connect(
    (state: ApplicationState) => state.client,
    ClientStore.actionCreators
)(DashboardPage);
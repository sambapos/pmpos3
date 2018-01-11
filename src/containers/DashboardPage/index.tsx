import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as ClientStore from '../../store/Client';
import { WithStyles } from 'material-ui';
import { RouteComponentProps } from 'react-router';
import decorate, { Style } from './style';
import TopBar from '../TopBar';

export type PageProps =
    ClientStore.ClientState
    & WithStyles<keyof Style>
    & typeof ClientStore.actionCreators
    & RouteComponentProps<{}>;

class DashboardPage extends React.Component<PageProps, {}> {
    public render() {
        return (
            <div className={this.props.classes.root}>
                <TopBar title="Dashboard" />
                <div className={this.props.classes.content}>
                    Placeholder for Dashboard. We'll see some metrics here.
                </div>
            </div>
        );
    }
}

export default decorate(connect(
    (state: ApplicationState) => state.client,
    ClientStore.actionCreators
)(DashboardPage));
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
                    1<br />
                    2<br />
                    3<br />
                    4<br />
                    5<br />
                    6<br />
                    7<br />
                    8<br />
                    9<br />
                    10<br />
                    1<br />
                    2<br />
                    3<br />
                    4<br />
                    5<br />
                    6<br />
                    7<br />
                    8<br />
                    9<br />
                    10<br />
                    1<br />
                    2<br />
                    3<br />
                    4<br />
                    5<br />
                    6<br />
                    7<br />
                    8<br />
                    9<br />
                    10<br />
                    1<br />
                    2<br />
                    3<br />
                    4<br />
                    5<br />
                    6<br />
                    7<br />
                    8<br />
                    9<br />
                    10<br />
                </div>
            </div>
        );
    }
}

export default decorate(connect(
    (state: ApplicationState) => state.client,
    ClientStore.actionCreators
)(DashboardPage));
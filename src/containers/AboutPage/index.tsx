import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as ClientStore from '../../store/Client';
import { RouteComponentProps } from 'react-router';
import TopBar from '../TopBar';
import Typography from 'material-ui/Typography/Typography';
import { Card } from 'material-ui';

export type PageProps =
    ClientStore.ClientState
    & typeof ClientStore.actionCreators
    & RouteComponentProps<{}>;

class HomePage extends React.Component<PageProps> {
    public render() {
        return (
            <div>
                <TopBar title="About PM-POS 3.0" />
                <Card style={{ margin: '8px', padding: '8px' }}>
                    <Typography variant="body2">
                        This project contains PoC's and Tests to demonstrate
                    some features of future SambaPOS versions.

                    </Typography>
                </Card>
                <Card style={{ margin: '8px', padding: '8px' }}>
                    <Typography variant="body1">
                        Version: {process.env.REACT_APP_VERSION}
                    </Typography>
                </Card>
                <Card style={{ margin: '8px', padding: '8px' }}>
                    <a href="https://github.com/emreeren/pmpos3/">
                        https://github.com/emreeren/pmpos3/
                        </a>
                </Card>
            </div>
        );
    }
}

export default connect(
    (state: ApplicationState) => state.client,
    ClientStore.actionCreators
)(HomePage);
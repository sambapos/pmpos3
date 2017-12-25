import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as ClientStore from '../../store/Client';
import { Button } from 'material-ui';
import { RouteComponentProps } from 'react-router';
import TopBar from '../TopBar';
import Typography from 'material-ui/Typography/Typography';

export type PageProps =
    ClientStore.ClientState
    & typeof ClientStore.actionCreators
    & RouteComponentProps<{}>;

class HomePage extends React.Component<PageProps> {
    public render() {
        return (
            <div>
                <TopBar title="About PM-POS 2.0" />
                <Typography type="body2">
                    This project contains PoC's and Tests to demonstrate
                    some features of future SambaPOS versions.
                </Typography>
                <br />
                <Button raised onClick={() => this.props.IncrementEnthusiasm()}>
                    HMR Test {this.props.enthusiasmLevel}
                </Button>
            </div>
        );
    }
}

export default connect(
    (state: ApplicationState) => state.client,
    ClientStore.actionCreators
)(HomePage);
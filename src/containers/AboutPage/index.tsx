import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as ClientStore from '../../store/Client';
import { Button } from 'material-ui';
import { RouteComponentProps } from 'react-router';

export type PageProps =
    ClientStore.ClientState
    & typeof ClientStore.actionCreators
    & RouteComponentProps<{}>;

class HomePage extends React.Component<PageProps> {
    public render() {
        return (
            <div>
                <h3>
                    About PM-POS 2.0
                </h3>
                <p>
                    PoC's and Tests for next SambaPOS versions.
                </p>
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
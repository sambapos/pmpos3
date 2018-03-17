import * as React from 'react';
import { TextField, Button } from 'material-ui';
import DialogContent from 'material-ui/Dialog/DialogContent';
import DialogActions from 'material-ui/Dialog/DialogActions';
import DialogTitle from 'material-ui/Dialog/DialogTitle';
import Typography from 'material-ui/Typography/Typography';
import decorate, { Style } from './style';
import { WithStyles } from 'material-ui/styles/withStyles';
import { Map as IMap } from 'immutable';
import RuleManager from '../../../RuleManager';

interface State {
    question: string;
    parameters: {};
    parameterState: IMap<string, any>;
}

interface PageProps {
    success: (actionType: string, data: any) => void;
    cancel: () => void;
    actionName: string;
    current?: any;
}

type Props = PageProps & WithStyles<keyof Style>;

class Component extends React.Component<Props, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            question: '',
            parameters: {},
            parameterState: IMap<string, any>()
        };
    }

    componentWillReceiveProps(props: Props) {
        if (props.current) {
            Object.keys(props.current.parameters).forEach(key => {
                let value = props.current.parameters[key];
                if (Array.isArray(value)) {
                    this.setState({ parameterState: this.state.parameterState.set(key, '') });
                } else {
                    this.setState({ parameterState: this.state.parameterState.set(key, value) });
                }
            });
        }
    }

    componentDidMount() {
        if (this.props.current) {
            this.setState({
                question: this.props.current.question,
                // "parameters":{"Name":"","Age":["1","2","3"]}
                parameters: this.props.current.parameters as {}
            });
        }
    }

    getParamEditor(key: string, value: any) {
        if (Array.isArray(value)) {

            return (
                <div key={key}>
                    <Typography variant="body2">{key}</Typography>
                    <div className={this.props.classes.buttonContainer}>
                        {(Array(...value).map(item => (
                            <Button
                                color={this.state.parameterState.get(key) === item ? 'secondary' : 'default'}
                                key={item} variant="raised" className={this.props.classes.selectionButton}
                                onClick={e => this.setState({
                                    parameterState: this.state.parameterState.set(key, item)
                                })}
                            >
                                {item}
                            </Button>
                        )))}
                    </div>
                </div >
            );
        }
        return <TextField label={key} key={key}
            value={this.state.parameterState.get(key)}
            onChange={e => this.setState({ parameterState: this.state.parameterState.set(key, e.target.value) })} />;
    }

    render() {
        return (
            <div>
                <DialogTitle>{this.state.question}</DialogTitle>
                <DialogContent style={{ display: 'flex', flexFlow: 'column' }}>
                    {Object.keys(this.state.parameters)
                        .map(key => this.getParamEditor(key, this.state.parameters[key]))}
                </DialogContent>
                <DialogActions>
                    {/* <Button onClick={() => this.props.cancel()}>Cancel</Button> */}
                    <Button
                        onClick={(e) => {
                            Object.keys(this.props.current.parameters).map(key => {
                                let value = this.state.parameterState.get(key);
                                RuleManager.setState(key, value);
                            });
                            this.props.success(this.props.actionName, this.props.current);
                        }}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </div>
        );
    }
}

export default decorate(Component);
import * as React from 'react';
import { TextField, Button } from 'material-ui';
import DialogContent from 'material-ui/Dialog/DialogContent';
import DialogActions from 'material-ui/Dialog/DialogActions';
import DialogTitle from 'material-ui/Dialog/DialogTitle';
import Typography from 'material-ui/Typography/Typography';
import decorate, { IStyle } from './style';
import { WithStyles } from 'material-ui/styles/withStyles';
import { Map as IMap } from 'immutable';
import IEditorProperties from '../editorProperties';
import { RuleManager } from 'pmpos-modules';

interface IState {
    question: string;
    parameters: {};
    parameterState: IMap<string, any>;
}

type Props = IEditorProperties<{ question: string, parameters: object }> & WithStyles<keyof IStyle>;

class Component extends React.Component<Props, IState> {

    constructor(props: any) {
        super(props);
        this.state = {
            question: '',
            parameters: {},
            parameterState: IMap<string, any>()
        };
    }

    public componentWillReceiveProps(props: Props) {
        const current = props.current;
        if (current) {
            Object.keys(current.parameters).forEach(key => {
                if (current) {
                    const value = current.parameters[key];
                    if (Array.isArray(value)) {
                        this.setState({ parameterState: this.state.parameterState.set(key, '') });
                    } else {
                        this.setState({ parameterState: this.state.parameterState.set(key, value) });
                    }
                }
            });
        }
    }

    public componentDidMount() {
        if (this.props.current) {
            this.setState({
                question: this.props.current.question,
                // "parameters":{"Name":"","Age":["1","2","3"]}
                parameters: this.props.current.parameters as {}
            });
        }
    }

    public render() {
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
                            if (this.props.current) {
                                Object.keys(this.props.current.parameters).map(key => {
                                    const value = this.state.parameterState.get(key);
                                    RuleManager.setState(key, value);
                                });
                            }
                            this.props.success(this.props.actionName, this.props.current);
                        }}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </div>
        );
    }

    private setTextValue(key: string, value: any) {
        this.setState({ parameterState: this.state.parameterState.set(key, value) });
    }

    private getParamEditor(key: string, value: any) {
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
        return <TextField label={key} key={key} type={this.getEditorType(key)}
            value={this.getTextValue(key)}
            onChange={e => this.setTextValue(key, e.target.value)} />;
    }

    private getEditorType(key: string): string {
        const val = this.state.parameters[key];
        const isNumber = !isNaN(parseFloat(val)) && isFinite(val);
        return isNumber ? 'number' : 'text';
    }

    private getTextValue(key: string) {
        return this.state.parameterState.get(key) || '';
    }
}

export default decorate(Component);
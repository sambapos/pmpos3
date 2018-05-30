import * as React from 'react';
import { TextField, Button, DialogContent, DialogActions, DialogTitle } from '@material-ui/core';
import decorate, { IStyle } from './style';
import { WithStyles } from '@material-ui/core/styles/withStyles';
import { Map as IMap } from 'immutable';
import IEditorProperties from '../editorProperties';
import { RuleManager } from 'pmpos-core';
import { vibrate } from '../../../../lib/helpers';
import SectionComponent from './SectionComponent';
import { IValueSelection } from "./IValueSelection";

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
            let parameterState = this.state.parameterState;
            Object.keys(current.parameters).forEach(key => {
                if (current) {
                    const value = current.parameters[key];
                    if (this.isArray(value)) {
                        parameterState = parameterState.set(key, '');
                    } else if (this.isObject(value)) {
                        parameterState = parameterState.set(key, value.selected)
                    } else {
                        parameterState = parameterState.set(key, value);
                    }
                }
            });
            this.setState({ parameterState });
        }
    }

    public componentDidMount() {
        if (this.props.current) {
            this.setState({
                question: this.props.current.question,
                // "parameters":{"Name":"","Age":["1","2","3"]},"Vegetables":{values:['a','b']}
                parameters: this.props.current.parameters as {}
            });
        }
    }

    public render() {
        return (
            <>
                <DialogTitle>{this.state.question}</DialogTitle>
                <DialogContent style={{ display: 'flex', flexFlow: 'column', overflow: 'auto' }}>
                    {Object.keys(this.state.parameters)
                        .map(key => this.getParamEditor(key, this.state.parameters[key]))}
                </DialogContent>
                <DialogActions>
                    {/* <Button onClick={() => this.props.cancel()}>Cancel</Button> */}
                    <Button
                        onClick={(e) => {
                            vibrate([10]);
                            if (this.props.current) {
                                Object
                                    .keys(this.props.current.parameters)
                                    .map(key => {
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
            </>
        );
    }

    private setTextValue(key: string, value: any) {
        this.setState({ parameterState: this.state.parameterState.set(key, value) });
    }

    private isArray(value: any) {
        return Array.isArray(value);
    }

    private isObject(value: any) {
        return Boolean(value.values);
    }

    private getParamEditor(key: string, value: any) {
        if (this.isArray(value)) {
            return (
                <SectionComponent
                    key={key}
                    name={key}
                    values={value}
                    onChange={(name: string, values: IValueSelection[]) =>
                        this.setState({
                            parameterState: this.state.parameterState.set(name, values[0] ? values[0].value : '')
                        })
                    }
                />
            );
        }
        if (this.isObject(value)) {
            return (
                <SectionComponent
                    key={key}
                    name={key}
                    selected={value.selected}
                    values={value.values}
                    max={value.max}
                    min={value.min}
                    onChange={(name: string, values: IValueSelection[]) =>
                        this.setState({
                            parameterState: this.state.parameterState.set(name, values[0] ? values[0].value : '')
                        })
                    }
                />
            );
        }
        return <TextField
            style={{ margin: 4 }} label={key} key={key}
            type={this.getEditorType(key)}
            value={this.getTextValue(key)}
            onFocus={e => e.target.select()}
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
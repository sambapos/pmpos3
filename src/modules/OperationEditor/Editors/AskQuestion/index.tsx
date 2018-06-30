import * as React from 'react';
import {
    TextField, Button, DialogContent, DialogActions, DialogTitle
} from '@material-ui/core';
import decorate, { IStyle } from './style';
import { WithStyles } from '@material-ui/core/styles/withStyles';
import { Map as IMap } from 'immutable';
import IEditorProperties from '../editorProperties';
import { RuleManager, CardRecord } from 'pmpos-core';
import { vibrate } from '../../../../lib/helpers';
import SectionComponent from '../SectionComponent';
import { ValueSelection } from "../SectionComponent/ValueSelection";
import { extract } from '../CardExtractor';
import MaskedTextInput from '../../../../components/MaskedTextInput';

interface IState {
    parameters: {};
    parameterState: IMap<string, any>;
}

type Props = IEditorProperties<{ question: string, parameters: object, selectedValues: object }> & WithStyles<keyof IStyle>;

class Component extends React.Component<Props, IState> {
    constructor(props: Props) {
        super(props);
        const parameters = props.current ? this.getParameters(props.current.parameters) : {};
        let parameterState = IMap<string, any>();
        Object.keys(parameters).forEach(key => {
            const value = parameters[key];
            if (this.isArray(value)) {
                parameterState = parameterState.set(key, '');
            } else if (this.isObject(value)) {
                parameterState = parameterState.set(key, value.selected)
            } else if (value && value.mask) {
                parameterState = parameterState.set(key, value.selected)
            } else {
                parameterState = parameterState.set(key, value);
            }
        });
        this.state = { parameters, parameterState };
    }

    public render() {
        return (
            <>
                <DialogTitle classes={{ root: this.props.classes.contentTitle }}>{this.props.current && this.props.current.question}</DialogTitle>
                <DialogContent classes={{ root: this.props.classes.contentRoot }}>
                    {Object.keys(this.state.parameters)
                        .map(key => this.getParamEditor(key, this.state.parameters[key]))}
                </DialogContent>
                <DialogActions>
                    {/* <Button onClick={() => this.props.cancel()}>Cancel</Button> */}
                    <Button
                        onClick={(e) => {
                            vibrate([10]);
                            const selected: any = {}
                            for (const key of Object.keys(this.state.parameters)) {
                                selected[key] = this.state.parameterState.get(key);
                            }
                            RuleManager.setState('selectedValues', selected);
                            if (this.props.current) {
                                this.props.current.selectedValues = selected;
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

    private getParameters(parameters: {}): {} {
        if (parameters instanceof CardRecord) {
            return extract(parameters);
        }
        return parameters;
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
                    max={1}
                    onChange={(name: string, values: ValueSelection[]) =>
                        this.setState({
                            parameterState: this.state.parameterState.set(name, values)
                        })
                    }
                />
            );
        }
        if (this.isObject(value) && value.values.length > 0) {
            return (
                <SectionComponent
                    key={key}
                    name={key}
                    selected={value.selected}
                    values={value.values}
                    max={value.max}
                    min={value.min}
                    onChange={(name: string, values: ValueSelection[]) =>
                        this.setState({
                            parameterState: this.state.parameterState.set(name, values)
                        })
                    }
                />
            );
        }
        if (value && value.mask) {
            return <MaskedTextInput key={key}
                style={{ margin: 4 }}
                label={key}
                mask={value.mask}
                placeholder={value.placeholder}
                placeholderChar={value.placeholderChar}
                unmaskRegExp={value.unmaskRegExp}
                value={this.getTextValue(key)}
                onChange={v => this.setTextValue(key, v)}
            />
        }
        if (this.isObject(value) && value.values.length === 0) {
            return <TextField
                style={{ margin: 4 }} label={key} key={key}
                multiline
                rows={value.lines || 3}
                value={this.getTextValue(key)}
                onFocus={e => e.target.select()}
                onChange={e => this.setTextValue(key, e.target.value)} />;
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
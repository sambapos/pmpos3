import * as React from "react";
import MaskedInput from 'react-text-mask';
import { FormControl, InputLabel, Input } from "@material-ui/core";

export interface IProps {
    mask: any;
    placeholder?: string;
    placeholderChar?: string;
    unmaskRegExp?: RegExp;
    label: string;
    value: any;
    style?: any;
    onChange: (value: string) => void;
}

export default class extends React.Component<IProps> {
    public render() {
        return <MaskedInput
            mask={this.props.mask}
            placeholder={this.props.placeholder}
            placeholderChar={this.props.placeholderChar}
            value={this.props.value}
            onChange={e => this.props.onChange(this.unMask(e.target.value, this.props.unmaskRegExp))}
            render={(ref, props) => (
                <FormControl fullWidth style={this.props.style}>
                    <InputLabel>{this.props.label}</InputLabel>
                    <Input
                        fullWidth
                        {...props}
                        inputRef={ref}
                        id="formatted-text-mask-input"
                    />
                </FormControl>
            )} />
    }

    private unMask(text: string, r: RegExp = /\D+/g) {
        return text.replace(r, '');
    }
}
import * as React from 'react';
import { InputAdornment, IconButton, Icon, FormControl, InputLabel, Input } from '@material-ui/core';

interface InputProps {
    className?: string;
    label: string;
    value: any;
    type?: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
    onCheckboxClick: () => void;
    isChecked: boolean;
}

export default (props: InputProps) => {
    return (<FormControl className={props.className} style={{ width: '100%' }}>
        <InputLabel>{props.label}</InputLabel>
        <Input
            fullWidth
            type={props.type || 'text'}
            value={props.value}
            onChange={props.onChange}
            endAdornment={
                <InputAdornment position="end">
                    <IconButton
                        aria-label="Toggle quantity visibility"
                        onClick={() => props.onCheckboxClick()}
                        onMouseDown={e => e.preventDefault()}
                    >
                        {props.isChecked
                            ? <Icon color="secondary">check_box</Icon>
                            : <Icon>check_box_outline_blank</Icon>}
                    </IconButton>
                </InputAdornment >
            }
        />
    </FormControl>);
};
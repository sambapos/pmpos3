import * as React from "react";
import { Button } from "@material-ui/core";
import decorate, { IStyle } from './style';
import { WithStyles } from '@material-ui/core/styles/withStyles';
import { ValueSelection } from "./ValueSelection";

export interface IStateButtonProps {
    value: ValueSelection;
    isSelected: (value: ValueSelection) => boolean;
    onClick: (value: ValueSelection) => void;
}

class StateButton extends React.Component<IStateButtonProps & WithStyles<keyof IStyle>> {
    public render() {
        const selected = this.props.isSelected(this.props.value);
        return (
            <Button
                size="small"
                color="primary"
                variant={selected ? 'raised' : 'outlined'}
                className={selected ? this.props.classes.selectionButtonSelected : this.props.classes.selectionButton}
                onClick={() => {
                    this.props.onClick(this.props.value);
                }}
            >
                {this.props.value.quantity > 1 ? `${this.props.value.quantity} x ` : ''}{this.props.value.display}
            </Button>
        );
    }
}

export default decorate(StateButton)
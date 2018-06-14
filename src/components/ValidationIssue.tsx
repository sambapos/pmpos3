import * as React from "react";
import { CardRecord } from "pmpos-core";
import { WithStyles } from '@material-ui/core/styles/withStyles';
import decorate, { IStyle } from './style';
import { Icon } from "@material-ui/core";

interface IProps {
    card: CardRecord;
    style?: any;
}

const ValidationIssue = (props: IProps & WithStyles<keyof IStyle>) => {
    if (props.card.isValid) {
        return null;
    }
    return <div style={props.style} className={props.classes.validationIssue}>
        <Icon style={{ float: 'left', fontSize: '1.4em', marginTop: -2, marginRight: 4 }}>highlight_off</Icon>
        {props.card.validationIssues.map(x => <div key={x}>{x}</div>)}
    </div>
}

export default decorate(ValidationIssue)
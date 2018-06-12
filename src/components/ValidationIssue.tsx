import * as React from "react";
import { CardRecord } from "pmpos-core";

interface IProps {
    card: CardRecord;
}

export default (props: IProps) => {
    return <div style={{ paddingLeft: 8, paddingBottom: 8, color: 'red', fontSize: '0.9em' }}>
        {props.card.validationIssues.map(x => <li key={x}>{x}</li>)}
    </div>
}
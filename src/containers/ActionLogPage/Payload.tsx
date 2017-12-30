import * as React from 'react';
import { Map as IMap } from 'immutable';
import PayloadItem from './PayloadItem';

export default (props: { item: IMap<string, any> }) => {
    if (!props.item || !props.item.entrySeq) { return <div>payload</div>; }
    return (
        <div>
            {props.item.entrySeq().map((x: any) => <PayloadItem key={x[0]} name={x[0]} value={x[1]} />)}
        </div>
    );
};
import * as React from 'react';
import { List as IList, Map as IMap } from 'immutable';
import { Paper } from 'material-ui';
import decorate, { Style } from './style';
import { WithStyles } from 'material-ui/styles/withStyles';
import CardTagData from '../../models/CardTagData';
import THead from './THead';

interface PageProps {
    searchValue: string;
    tags: IList<CardTagData>;
}

type Props = PageProps & WithStyles<keyof Style>;

const LocationTable = (props: Props) => {
    let firstTag = props.tags.first();
    if (!firstTag || !firstTag.isAccount(props.searchValue)) {
        return null;
    }
    let balances = props.tags.reduce(
        (r, d) => {
            return r.update(d.tag.value + (d.tag.unit ? '.' + d.tag.unit : ''), o => {
                return (o || IMap<string, number>())
                    .update('in', v => (v || 0) + d.tag.getInQuantityFor(props.searchValue))
                    .update('out', v => (v || 0) + d.tag.getOutQuantityFor(props.searchValue));
            });
        },
        IMap<string, IMap<string, number>>());
    return (
        <Paper className={props.classes.card}>
            <table className={props.classes.table}>
                <THead keys={['Name', 'In', 'Out', 'Remaining']} />
                <tbody>{balances.map((v, k) => {
                    return (
                        <tr key={k} className={props.classes.tableRow}>
                            <td className={props.classes.tableCell}>
                                <div>{k}</div>
                            </td>
                            <td className={props.classes.tableCellNumber}>
                                {v.get('in')}
                            </td>
                            <td className={props.classes.tableCellNumber}>
                                {v.get('out')}
                            </td>
                            <td className={props.classes.tableCellNumber}>
                                {(v.get('in') || 0) - (v.get('out') || 0)}
                            </td>
                        </tr>
                    );
                }).valueSeq()}</tbody>
            </table>
        </Paper>
    );
};

export default decorate(LocationTable);
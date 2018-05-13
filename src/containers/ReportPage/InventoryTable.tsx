import * as React from 'react';
import * as moment from 'moment';
import { List as IList } from 'immutable';
import { Paper } from 'material-ui';
import decorate, { IStyle } from './style';
import { WithStyles } from 'material-ui/styles/withStyles';
import THead from './THead';
import { CardTagData } from 'pmpos-models';

interface IPageProps {
    searchValue: string;
    tags: IList<CardTagData>;
}

type Props = IPageProps & WithStyles<keyof IStyle>;

const InventoryTable = (props: Props) => {
    let balance = 0;
    const firstTag = props.tags.first();
    if (!firstTag
        || !firstTag.tag.value.toLowerCase().includes(props.searchValue.toLowerCase())
        || firstTag.tag.quantity === 0) {
        return null;
    }
    return (
        <Paper className={props.classes.card}>
            <table className={props.classes.table}>
                <THead keys={['Name', 'In', 'Out', 'Remaining']} />
                <tbody>{
                    props.tags.sort((a, b) => a.time - b.time).map(tagData => {
                        balance += tagData.getTotalFor(props.searchValue);
                        return tagData && (
                            <tr key={tagData.id} className={props.classes.tableRow}>
                                <td className={props.classes.tableCell}>
                                    <div>{tagData.display}</div>
                                    <div className={props.classes.tableSecondary}>
                                        {tagData.name + ' ' + moment(tagData.time).format('LLL')}
                                    </div>
                                </td>
                                <td className={props.classes.tableCellNumber}>
                                    {tagData.getInDisplayFor(props.searchValue)}
                                </td>
                                <td className={props.classes.tableCellNumber}>
                                    {tagData.getOutDisplayFor(props.searchValue)}
                                </td>
                                <td className={props.classes.tableCellNumber}>
                                    {balance !== 0 ? balance : ''}
                                </td>
                            </tr>
                        );
                    })
                }
                </tbody>
            </table>
        </Paper>
    );
};

export default decorate(InventoryTable);
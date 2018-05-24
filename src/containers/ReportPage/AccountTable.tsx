import * as React from 'react';
import * as moment from 'moment';
import { List as IList } from 'immutable';
import { Paper } from '@material-ui/core';
import decorate, { IStyle } from './style';
import { WithStyles } from '@material-ui/core/styles/withStyles';
import THead from './THead';
import { CardTagData } from 'pmpos-core';

interface IPageProps {
    searchValue: string;
    tags: IList<CardTagData>;
}

type Props = IPageProps & WithStyles<keyof IStyle>;

const AccountTable = (props: Props) => {
    let balance = 0;
    const firstTag = props.tags.first();
    if (!firstTag) {
        return null;
    }
    return (
        <Paper className={props.classes.card}>
            <table className={props.classes.table}>
                <THead keys={['Name', 'Debit', 'Credit', 'Balance']} />
                <tbody>{props.tags
                    .filter(t => t.getDebitFor(props.searchValue) !== 0 || t.getCreditFor(props.searchValue) !== 0)
                    .sort((a, b) => a.time - b.time).map(tagData => {
                        balance += tagData.getBalanceFor(props.searchValue);
                        return tagData && (
                            <tr key={tagData.id} className={props.classes.tableRow}>
                                <td className={props.classes.tableCell}>
                                    <div>{tagData.display}</div>
                                    <div className={props.classes.tableSecondary}>
                                        {tagData.name + ' ' + moment(tagData.time).format('LLL')}
                                    </div>
                                </td>
                                <td className={props.classes.tableCellNumber}>
                                    {tagData.getDebitDisplayFor(props.searchValue)}
                                </td>
                                <td className={props.classes.tableCellNumber}>
                                    {tagData.getCreditDisplayFor(props.searchValue)}
                                </td>
                                <td className={props.classes.tableCellNumber}>
                                    {balance !== 0 ? balance.toFixed(2) : ''}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </Paper>
    );
};

export default decorate(AccountTable);
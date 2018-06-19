import * as React from 'react';
import * as moment from 'moment';
import { List as IList } from 'immutable';
import { Paper } from '@material-ui/core';
import decorate, { IStyle } from './style';
import { WithStyles } from '@material-ui/core/styles/withStyles';
import THead from './THead';
import { CardTagData } from 'pmpos-core';
import { ReportView } from './ReportView';

interface IPageProps {
    searchValue: string;
    tags: IList<CardTagData>;
}

type Props = IPageProps & WithStyles<keyof IStyle>;

interface IState {
    view: ReportView | undefined;
}

class AccountTable extends React.Component<Props, IState> {
    constructor(props: Props) {
        super(props);
        this.state = { view: undefined }
    }

    public componentWillReceiveProps(nextProps: Props) {
        if (nextProps.tags !== this.props.tags) {
            this.setState({
                view: new ReportView(nextProps.tags, nextProps.searchValue)
            })
        }
    }
    public render() {
        const firstTag = this.props.tags.first();
        if (!firstTag) {
            return null;
        }
        if (!this.state.view) { return null };
        const lines = this.state.view.getLines().filter(x => x.credit !== 0 || x.debit !== 0);
        return (
            <Paper className={this.props.classes.card}>
                <table className={this.props.classes.table}>
                    <THead type="AccountTable" keys={['Name', 'Debit', 'Credit', 'Balance']} />
                    <tbody>{lines.map(line => {
                        return line && (
                            <tr key={line.id} className={this.props.classes.tableRow}>
                                <td className={this.props.classes.tableCell}>
                                    <div>{line.display}</div>
                                    <div className={this.props.classes.tableSecondary}>
                                        {line.name + ' ' + moment(line.time).format()}
                                    </div>
                                    {line.expires && <div className={this.props.classes.tableSecondary}>
                                        expires: {line.expirationDate}
                                    </div>}
                                </td>
                                <td className={this.props.classes.tableCellNumber}>
                                    {line.DebitDisplay}
                                </td>
                                <td className={this.props.classes.tableCellNumber}>
                                    {line.CreditDisplay}
                                </td>
                                <td className={this.props.classes.tableCellNumber}>
                                    {line.BalanceDisplay}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </Paper>
        );
    }
};

export default decorate(AccountTable);
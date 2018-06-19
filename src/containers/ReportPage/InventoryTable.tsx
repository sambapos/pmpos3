import * as React from 'react';
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

interface IState {
    view: ReportView | undefined;
}

type Props = IPageProps & WithStyles<keyof IStyle>;

export class InventoryTable extends React.Component<Props, IState> {
    constructor(props: Props) {
        super(props);
        this.state = { view: undefined }
    }

    public componentWillReceiveProps(nextProps: Props) {
        if (nextProps.searchValue !== this.props.searchValue) {
            this.setState({ view: new ReportView(nextProps.tags, nextProps.searchValue) })
        }
    }

    public render() {
        const firstTag = this.props.tags.first();
        if (!firstTag
            // || !firstTag.tag.value.toLowerCase().includes(this.props.searchValue.toLowerCase())
            || firstTag.tag.quantity === 0) {
            return null;
        }
        if (!this.state.view) { return null };
        const lines = this.state.view.getLines();
        return (
            <Paper className={this.props.classes.card}>
                <table className={this.props.classes.table}>
                    <THead type="InventoryTable" keys={['Name', 'In', 'Out', 'Remaining']} />
                    <tbody>{
                        lines.map(line => {
                            return line && (
                                <tr key={line.id} className={this.props.classes.tableRow}>
                                    <td className={this.props.classes.tableCell}>
                                        <div>{line.display}</div>
                                        <div className={this.props.classes.tableSecondary}>
                                            {line.name + ' ' + line.transactionDate}
                                        </div>
                                        {line.expires && <div className={this.props.classes.tableSecondary}>
                                            expires: {line.expirationDate}
                                        </div>}
                                    </td>
                                    <td className={this.props.classes.tableCellNumber}>
                                        {line.InDisplay}
                                    </td>
                                    <td className={this.props.classes.tableCellNumber}>
                                        {line.OutDisplay}
                                    </td>
                                    <td className={this.props.classes.tableCellNumber}>
                                        {line.RemainingDisplay}
                                    </td>
                                </tr>
                            );
                        })
                    }
                    </tbody>
                </table>
            </Paper>
        );
    }
};

export default decorate(InventoryTable);
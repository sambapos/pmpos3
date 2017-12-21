import * as React from 'react';
import { WithStyles, Paper, Table, TableHead, TableRow, TableCell, TableBody } from 'material-ui';
import decorate, { Style } from './style';
import { List } from 'immutable';

interface TaskListProps {
    tasks: List<Map<any, any>>;
}

type Props = TaskListProps & WithStyles<keyof Style>;

const TaskList = (props: Props) => {
    return (
        <Paper className={props.classes.paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Estimate</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        props.tasks.map(x => {
                            return (
                                <TableRow hover key={x ? x.get('id') : ''}>
                                    <TableCell>{x && x.get('title')}</TableCell>
                                    <TableCell numeric>{x && x.get('estimate')}</TableCell>
                                </TableRow>
                            );
                        })
                    }
                </TableBody>
            </Table>
        </Paper>
    );
};

export default decorate(TaskList);
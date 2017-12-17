import * as React from 'react';
import { connect } from 'react-redux';
import * as TaskStore from '../../store/Tasks';
import { RouteComponentProps } from 'react-router';
import { TaskRecord } from '../../store/Tasks';
import { List } from 'immutable';
import { Button, TextField, WithStyles } from 'material-ui';
import Typography from 'material-ui/Typography/Typography';
import Card from 'material-ui/Card/Card';
import withStyles from 'material-ui/styles/withStyles';
import CardContent from 'material-ui/Card/CardContent';
import Paper from 'material-ui/Paper/Paper';
import Table from 'material-ui/Table/Table';
import TableHead from 'material-ui/Table/TableHead';
import TableRow from 'material-ui/Table/TableRow';
import TableBody from 'material-ui/Table/TableBody';
import TableCell from 'material-ui/Table/TableCell';

const decorate = withStyles(({ palette, spacing, breakpoints }) => ({
    card: {
        minWidth: 275,
    },
    content: {
        height: '100%',
        display: 'flex',
        [breakpoints.down('sm')]: {
            flexFlow: 'column'
        },
        [breakpoints.up('md')]: {
            width: '900px',
            alignSelf: 'center'
        },
    },
    paper: {
        [breakpoints.down('sm')]: {
            marginTop: spacing.unit * 3,
        },
        [breakpoints.up('sm')]: {
            marginLeft: spacing.unit * 3,
        },

        flex: '1 1 auto',
        overflowX: 'auto' as 'auto',
    }
}));

export type TasksPageProps =
    { tasks: List<TaskRecord> }
    & WithStyles<'card' | 'paper' | 'content'>
    & typeof TaskStore.actionCreators
    & RouteComponentProps<{}>;

class TasksPage extends React.Component<TasksPageProps, { title: string }> {
    state = { title: '' };

    addTask() {
        this.props.addTask(this.state.title);
        this.props.setTaskEstimate(
            this.props.tasks.count(),
            this.props.tasks.count());
        this.setState({ title: '' });
    }

    public render() {
        return (
            <div className={this.props.classes.content}>
                <Card className={this.props.classes.card}>
                    <CardContent>
                        <Typography type="headline">
                            Add a Task
                            </Typography>
                        <TextField
                            required
                            id="required"
                            label="Enter Task Title"
                            margin="normal"
                            value={this.state.title}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    this.addTask();
                                }
                            }}
                            onChange={(e) => this.setState({ title: e.target.value })}
                        />
                        <Button
                            disabled={!this.state.title}
                            onClick={() => this.addTask()}
                        >Add
                        </Button>
                    </CardContent>
                </Card>

                <Paper className={this.props.classes.paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Estimate</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this.props.tasks.map(x => {
                                    return (
                                        <TableRow hover key={x ? x.id : ''}>
                                            <TableCell>{x && x.title}</TableCell>
                                            <TableCell numeric>{x && x.estimate}</TableCell>
                                        </TableRow>
                                    );
                                })
                            }
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        );
    }
}

const mapStateToProps = state => ({ tasks: state.tasks });

export default decorate(connect(
    mapStateToProps,
    TaskStore.actionCreators
)(TasksPage));
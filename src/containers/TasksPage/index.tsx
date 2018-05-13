import * as React from 'react';
import { connect } from 'react-redux';
import * as TaskStore from '../../store/Tasks';
import { RouteComponentProps } from 'react-router';
import { List } from 'immutable';
import { WithStyles } from 'material-ui';

import decorate, { IStyle } from './style';
import TopBar from '../TopBar';
import AddTask from './AddTask';
import TaskList from './TaskList';

export type TasksPageProps =
    { tasks: List<Map<any, any>> }
    & WithStyles<keyof IStyle>
    & typeof TaskStore.actionCreators
    & RouteComponentProps<{}>;

class TasksPage extends React.Component<TasksPageProps, {}> {

    public render() {
        return (
            <div className={this.props.classes.root}>
                <TopBar title="Tasks" />
                <div className={this.props.classes.content}>
                    <AddTask addTask={(title: string) => this.addTask(title)} />
                    <TaskList tasks={this.props.tasks} />
                </div>
            </div>
        );
    }

    private addTask(title: string) {
        this.props.addTask(title);
        this.props.setTaskEstimate(
            this.props.tasks.count(),
            this.props.tasks.count());
    }
}

const mapStateToProps = state => ({ tasks: state.tasks });

export default decorate(connect(
    mapStateToProps,
    TaskStore.actionCreators
)(TasksPage));
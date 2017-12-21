import * as React from 'react';
import { connect } from 'react-redux';
import * as TaskStore from '../../store/Tasks';
import { RouteComponentProps } from 'react-router';
import { List } from 'immutable';
import { WithStyles } from 'material-ui';

import decorate, { Style } from './style';
import TopBar from '../TopBar';
import AddTask from './AddTask';
import TaskList from './TaskList';

export type TasksPageProps =
    { tasks: List<Map<any, any>> }
    & WithStyles<keyof Style>
    & typeof TaskStore.actionCreators
    & RouteComponentProps<{}>;

class TasksPage extends React.Component<TasksPageProps, {}> {

    addTask(title: string) {
        this.props.addTask(title);
        this.props.setTaskEstimate(
            this.props.tasks.count(),
            this.props.tasks.count());
    }

    public render() {
        return (
            <div className={this.props.classes.content}>
                <TopBar title="Tasks" />
                <AddTask addTask={(title: string) => this.addTask(title)} />
                <TaskList tasks={this.props.tasks} />
            </div>
        );
    }
}

const mapStateToProps = state => ({ tasks: state.tasks });

export default decorate(connect(
    mapStateToProps,
    TaskStore.actionCreators
)(TasksPage));
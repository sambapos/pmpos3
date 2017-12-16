import * as React from 'react';
import { connect } from 'react-redux';
import * as TaskStore from '../../store/Tasks';
import { RouteComponentProps } from 'react-router';
import { TaskRecord } from '../../store/Tasks';
import { List } from 'immutable';

export type TasksPageProps =
    { tasks: List<TaskRecord> }
    & typeof TaskStore.actionCreators
    & RouteComponentProps<{}>;

class TasksPage extends React.Component<TasksPageProps, {}> {
    public render() {
        return (
            <div>
                <h3>
                    Tasks
                </h3>
                <button
                    onClick={() => {
                        this.props.addTask('Deneme');
                        this.props.setTaskEstimate(
                            this.props.tasks.count(),
                            this.props.tasks.count());
                    }}
                >add task
                </button>
                {
                    this.props.tasks.map(x => {
                        return (<div key="">{x && x.title + x.estimate}</div>);
                    })
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        tasks: state.tasks
    };
};

export default connect(
    mapStateToProps,
    TaskStore.actionCreators
)(TasksPage);
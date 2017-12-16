import { Reducer } from 'redux';
import { List } from 'immutable';
import { makeTypedFactory, TypedRecord } from 'typed-immutable-record';
import { AppThunkAction } from './appThunkAction';

type AddTaskAction = {
    type: 'ADD_TASK',
    title: string
};

type SetTaskEstimateAction = {
    type: 'SET_TASK_ESTIMATE',
    index: number,
    estimate: number,
};

type TasksAction = AddTaskAction | SetTaskEstimateAction;

interface Task {
    title: string;
    estimate?: number;
}

export interface TaskRecord extends TypedRecord<TaskRecord>, Task { }

const makeTask = makeTypedFactory<Task, TaskRecord>({
    title: '',
    estimate: undefined
});

export const reducer: Reducer<List<TaskRecord>> = (
    state: List<TaskRecord> = List<TaskRecord>(),
    action: TasksAction
): List<TaskRecord> => {
    switch (action.type) {
        case 'ADD_TASK':
            return state.push(makeTask({ title: action.title, estimate: 0 }));
        case 'SET_TASK_ESTIMATE':
            const newTask = state
                .get(action.index)
                .set('estimate', action.estimate);
            return state.set(action.index, newTask);
        default:
            return state;
    }
};

export const actionCreators = {
    addTask: (title: string): AppThunkAction<TasksAction> => (dispatch, getState) => {
        dispatch({ type: 'ADD_TASK', title });
    },
    setTaskEstimate: (index: number, estimate: number) => <SetTaskEstimateAction>{
        type: 'SET_TASK_ESTIMATE', index, estimate
    },
};
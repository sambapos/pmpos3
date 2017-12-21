import { Reducer } from 'redux';
import { List, fromJS } from 'immutable';
import { AppThunkAction } from './appThunkAction';
import { uuidv4 } from './uuid';

type AddTaskAction = {
    type: 'ADD_TASK',
    title: string
};

type SetTaskEstimateAction = {
    type: 'SET_TASK_ESTIMATE',
    index: number,
    estimate: number
};

type TasksAction = AddTaskAction | SetTaskEstimateAction;

export const reducer: Reducer<List<Map<any, any>>> = (
    state: List<Map<any, any>> = List<Map<any, any>>(),
    action: TasksAction
): List<Map<any, any>> => {
    switch (action.type) {
        case 'ADD_TASK':
            return state.push(fromJS({ id: uuidv4(), title: action.title, estimate: 0, date: new Date() }));
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
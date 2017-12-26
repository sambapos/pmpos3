import { Reducer } from 'redux';
import { List as IList, Map as IMap, fromJS } from 'immutable';
import { AppThunkAction } from './appThunkAction';
import { uuidv4 } from '../lib/uuid';

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

export const reducer: Reducer<IList<IMap<any, any>>> = (
    state: IList<IMap<any, any>> = IList<IMap<any, any>>(),
    action: TasksAction
): IList<IMap<any, any>> => {
    switch (action.type) {
        case 'ADD_TASK':
            return state.push(fromJS({ id: uuidv4(), title: action.title, estimate: 0, date: new Date() }));
        case 'SET_TASK_ESTIMATE':
            const currentTask = state.get(action.index);
            if (currentTask) {
                const newTask =
                    currentTask.set('estimate', action.estimate);
                return state.set(action.index, newTask);
            }
            return state;
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
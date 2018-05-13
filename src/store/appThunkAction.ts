import { IApplicationState } from './index';

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export type IAppThunkAction<TAction> = (dispatch: (action: TAction) => void, getState: () => IApplicationState) => void;

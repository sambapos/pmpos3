import { RouteComponentProps } from 'react-router-dom';
import * as ClientStore from '../store/Client';

export type PageProps =
    ClientStore.ClientState
    & typeof ClientStore.actionCreators
    & RouteComponentProps<{}>;

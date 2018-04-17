import { List } from 'immutable';
import { WithStyles } from 'material-ui';
import { Style } from './style';
import { RouteComponentProps } from 'react-router';
import * as CardStore from '../../store/Cards';
import * as ClientStore from '../../store/Client';
import { ActionRecord, CardRecord, CommitRecord } from 'pmpos-models';

export type CardPageProps =
    {
        isLoaded: boolean,
        failed: boolean,
        pendingActions: List<ActionRecord>
        card: CardRecord,
        commits: List<CommitRecord>
    }
    & WithStyles<keyof Style>
    & typeof CardStore.actionCreators
    & typeof ClientStore.actionCreators
    & RouteComponentProps<{ id?: string }>;
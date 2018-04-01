import { ActionRecord } from '../../models/Action';
import { List } from 'immutable';
import { CardRecord } from '../../models/Card';
import { CommitRecord } from '../../models/Commit';
import { WithStyles } from 'material-ui';
import { Style } from './style';
import { RouteComponentProps } from 'react-router';
import * as CardStore from '../../store/Cards';
import * as ClientStore from '../../store/Client';

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
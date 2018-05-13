import { WithStyles } from 'material-ui';
import { IStyle } from './style';
import { RouteComponentProps } from 'react-router';
import * as CardStore from '../../store/Cards';
import * as ClientStore from '../../store/Client';
import { CardRecord } from 'pmpos-models';

export type CardPageProps =
    {
        closeCardRequested: boolean,
        failed: boolean,
        card: CardRecord
    }
    & WithStyles<keyof IStyle>
    & typeof CardStore.actionCreators
    & typeof ClientStore.actionCreators
    & RouteComponentProps<{ id?: string }>;
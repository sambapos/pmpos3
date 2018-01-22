import * as React from 'react';
import Tags from './Tags';
import SubCards from './SubCards';
import classNames from 'classnames';
import { CardRecord } from '../../models/Card';
import { WithStyles, Icon } from 'material-ui';
import decorate, { Style } from './style';
import { CardTagRecord } from '../../models/CardTag';
import { CardTypeRecord } from '../../models/CardType';

interface CardContentProps {
    card: CardRecord;
    cardType: CardTypeRecord | undefined;
    selectedCardId: string;
    onClick: (card: CardRecord, target: any) => void;
    handleTagClick: (card: CardRecord, value: CardTagRecord) => void;
}

type PageProps = CardContentProps & WithStyles<keyof Style>;

const CardPageContent = (props: PageProps) => {
    return (
        <div className={props.card.cards.count() > 0 ? props.classes.node : props.classes.leaf} >
            <div className={classNames(
                props.classes.cardLine, {
                    [props.classes.selectedCardLine]: props.selectedCardId === props.card.id
                }
            )}>
                <Icon
                    onClick={e => props.onClick(props.card, e.target)}
                    color="primary"
                    className={props.classes.cardLineIcon}
                >
                    more_vert
                </Icon>
                <Tags
                    card={props.card}
                    cardType={props.cardType}
                    handleTagClick={props.handleTagClick}
                />
            </div>
            <SubCards
                card={props.card}
                selectedCardId={props.selectedCardId}
                onClick={props.onClick}
                handleTagClick={props.handleTagClick}
            />
        </div >
    );
};

export default decorate(CardPageContent);
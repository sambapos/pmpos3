import * as React from 'react';
import Tags from './Tags';
import SubCards from './SubCards';
import classNames from 'classnames';
import { WithStyles, Icon } from 'material-ui';
import decorate, { Style } from './style';
import { CardRecord, CardTypeRecord } from 'pmpos-models';

interface CardContentProps {
    card: CardRecord;
    cardType: CardTypeRecord | undefined;
    selectedCardId: string;
    onClick: (card: CardRecord, target: any) => void;
    handleCardClick: (card: CardRecord) => void;
}

type PageProps = CardContentProps & WithStyles<keyof Style>;

const CardPageContent = (props: PageProps) => {
    let drawIcon = props.card.id === props.selectedCardId;
    return (
        <div
            className={props.card.cards.count() > 0 ? props.classes.node : props.classes.leaf} >
            <div
                className={classNames(
                    props.classes.cardLine, {
                        [props.classes.selectedCardLine]: props.selectedCardId === props.card.id
                    }
                )}>
                {drawIcon && <Icon
                    onClick={e => props.onClick(props.card, e.target)}
                    color="primary"
                    className={props.classes.cardLineIcon}
                >
                    more_vert
                </Icon>}
                <Tags card={props.card} handleCardClick={props.handleCardClick} />
            </div>
            <SubCards
                card={props.card}
                selectedCardId={props.selectedCardId}
                onClick={props.onClick}
                handleCardClick={props.handleCardClick}
            />
        </div >
    );
};

export default decorate(CardPageContent);
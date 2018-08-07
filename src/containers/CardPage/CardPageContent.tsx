import * as React from 'react';
import Tags from './Tags';
import SubCards from './SubCards';
import * as classNames from 'classnames';
import { WithStyles, Icon } from '@material-ui/core';
import decorate, { IStyle } from './style';
import { CardRecord, CardTypeRecord } from 'sambadna-core';

interface ICardContentProps {
    card: CardRecord;
    parentCard: CardRecord | undefined;
    cardType: CardTypeRecord | undefined;
    selectedCardId: string;
    hasPendingActions: boolean;
    onClick: (card: CardRecord, target: any) => void;
    handleCardClick: (card: CardRecord) => void;
}

type PageProps = ICardContentProps & WithStyles<keyof IStyle>;

const CardPageContent = (props: PageProps) => {
    const drawIcon = props.card.id === props.selectedCardId;
    return (
        <div className={props.classes.nodeContent}>
            <div className={props.classes.spacer}
                style={{ backgroundColor: props.cardType ? props.cardType.color : 'transparent' }} />
            <div className={props.card.cards.count() > 0 ? props.classes.node : props.classes.leaf}>
                <div
                    className={classNames(
                        props.classes.cardLine, {
                            [props.classes.selectedCardLine]: props.selectedCardId === props.card.id,
                            [props.classes.pendingCardLine]: props.hasPendingActions
                        }
                    )}>
                    {drawIcon && <Icon
                        onClick={e => props.onClick(props.card, e.target)}
                        color="primary"
                        className={props.classes.cardLineIcon}
                    >
                        more_vert
                </Icon>}
                    <Tags card={props.card} parentCard={props.parentCard} handleCardClick={props.handleCardClick} />
                </div>
                <SubCards
                    card={props.card}
                    selectedCardId={props.selectedCardId}
                    onClick={props.onClick}
                    handleCardClick={props.handleCardClick}
                />
            </div>
        </div >
    );
};

export default decorate(CardPageContent);
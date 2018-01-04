import * as React from 'react';
import Tags from './Tags';
import SubCards from './SubCards';
import { CardRecord, CardTagRecord } from '../../models/Card';
import { WithStyles, Icon } from 'material-ui';
import decorate, { Style } from './style';

interface CardContentProps {
    card: CardRecord;
    selectedCard: CardRecord;
    onClick: (card: CardRecord, target: any) => void;
    handleTagClick: (card: CardRecord, value: CardTagRecord) => void;
}

type PageProps = CardContentProps & WithStyles<keyof Style>;

const CardPageContent = (props: PageProps) => {
    let isSelected: boolean = props.card.id === props.selectedCard.id;
    return (
        <div >
            <div className={props.classes.cardLine}>
                <Icon
                    onClick={e => props.onClick(props.card, e.target)}
                    color="primary"
                    className={props.classes.cardLineIcon}
                >
                    {isSelected ? 'radio_button_checked' : 'radio_button_unchecked'}
                </Icon>
                <Tags card={props.card} handleTagClick={props.handleTagClick} />
            </div>
            <SubCards
                card={props.card}
                selectedCard={props.selectedCard}
                onClick={props.onClick}
                handleTagClick={props.handleTagClick}
            />
        </div>
    );
};

export default decorate(CardPageContent);
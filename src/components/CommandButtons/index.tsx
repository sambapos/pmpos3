import * as React from 'react';
import { Button, WithStyles } from '@material-ui/core';
import { CommandButton } from '../CommandButton';
import decorate, { IStyle } from './style';
import { CardRecord } from 'sambadna-core';

interface ICommandButtonsProps {
    buttons: CommandButton[];
    card: CardRecord;
    handleButtonClick: (card: CardRecord, button: CommandButton) => void;
}

const CommandButtons = (props: ICommandButtonsProps & WithStyles<keyof IStyle>) => {
    return <div className={props.classes.commandButtonsContainer}>
        {props.buttons.map(button => (
            <Button size="large" variant="raised" className={props.classes.button}
                color={button.color as any}
                key={`cmd_${button.caption}_${props.card.id}`}
                onClick={e => {
                    props.handleButtonClick(props.card, button);
                }}>
                {button.caption}
            </Button>
        ))}
    </div>;
};

export default decorate(CommandButtons);
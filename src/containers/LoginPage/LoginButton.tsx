import * as React from 'react';
import { Button, WithStyles } from 'material-ui';
import decorate, { Style } from './style';

interface LoginButtonProps {
    value: string;
    icon?: string;
    onClick: (value: string) => void;
}

type Props = LoginButtonProps & WithStyles<keyof Style>;

const LoginButton = (props: Props) => {
    return (
        <Button
            className={props.classes.loginButton}
            raised
            color="primary"
            onClick={(e) => props.onClick(props.value)}
        >{!props.icon ? props.value : <i className="material-icons">{props.icon}</i>}
        </Button>
    );
};

export default decorate(LoginButton);
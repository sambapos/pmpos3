import * as React from 'react';
import { AppBar, Toolbar, IconButton, Typography, WithStyles } from 'material-ui';
import classNames from 'classnames';
import decorate, { Style } from './style';
import * as ClientStore from '../../store/Client';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store/index';

interface TopBarProps {
    title: string;
}

type Props =
    TopBarProps
    & ClientStore.ClientState
    & typeof ClientStore.actionCreators
    & WithStyles<keyof Style>;

const topBar = (props: Props) => {
    let anchor = 'Left';
    return (
        <AppBar
            className={classNames(props.classes.appBar, {
                [props.classes.appBarShift]: props.drawerOpen,
                [props.classes[`appBarShift${anchor}`]]: props.drawerOpen,
            })}
        >
            <Toolbar>
                <IconButton
                    color="contrast"
                    aria-label="open drawer"
                    onClick={() => props.ToggleDrawer()}
                >
                    <i className="material-icons">menu</i>
                </IconButton>
                <Typography
                    type="title"
                    color="inherit"
                >
                    {props.title}
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default decorate<{ title: string }>(connect(
    (state: ApplicationState) => state.client,
    ClientStore.actionCreators
)(topBar));
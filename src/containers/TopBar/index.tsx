import * as React from 'react';
import { AppBar, Toolbar, Typography, WithStyles } from 'material-ui';
import classNames from 'classnames';
import decorate, { Style } from './style';
import * as ClientStore from '../../store/Client';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store/index';
import MenuButton, { MenuCommand } from './MenuButton';

interface TopBarProps {
    title: string;
    menuCommand: MenuCommand;
    secondaryCommands?: MenuCommand[];
}

type Props =
    TopBarProps
    & ClientStore.ClientState
    & typeof ClientStore.actionCreators
    & WithStyles<keyof Style>;

const topBar = (props: Props) => {
    let anchor = 'Left';
    let menuCommand = props.menuCommand
        ? props.menuCommand
        : { icon: 'menu', onClick: () => { props.ToggleDrawer(); } };
    return (
        <AppBar
            className={classNames(props.classes.appBar, {
                [props.classes.appBarShift]: props.drawerOpen,
                [props.classes[`appBarShift${anchor}`]]: props.drawerOpen,
            })}
        >
            <Toolbar disableGutters={!props.drawerOpen} className={props.classes.toolbar}>
                <MenuButton command={menuCommand} />
                <Typography
                    className={props.classes.flex}
                    type="title"
                    color="inherit"
                >
                    {props.title}
                </Typography>
                {props.secondaryCommands && props.secondaryCommands.map(x => {
                    return <MenuButton key={x.icon} command={x} menuItems={x.menuItems} />;
                })}
            </Toolbar>
        </AppBar>
    );
};

export default decorate<{ title: string, menuCommand?: MenuCommand, secondaryCommands?: MenuCommand[] }>(connect(
    (state: ApplicationState) => state.client,
    ClientStore.actionCreators
)(topBar));
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

class TopBar extends React.Component<Props, {}> {

    render() {
        let anchor = 'Left';
        let menuCommand = this.props.menuCommand
            ? this.props.menuCommand
            : { icon: 'menu', onClick: () => { this.props.ToggleDrawer(); } };
        return (
            <AppBar
                className={classNames(this.props.classes.appBar, {
                    [this.props.classes.appBarShift]: this.props.drawerOpen,
                    [this.props.classes[`appBarShift${anchor}`]]: this.props.drawerOpen,
                })}
            >
                <Toolbar disableGutters={!this.props.drawerOpen} className={this.props.classes.toolbar}>
                    <MenuButton command={menuCommand} />
                    <Typography
                        type="title"
                        color="inherit"
                    >
                        {this.props.title}
                    </Typography>
                    <div className={this.props.classes.flex}>
                        {this.props.children}
                    </div>
                    {this.props.secondaryCommands && this.props.secondaryCommands.map(x => {
                        return <MenuButton key={x.icon} command={x} menuItems={x.menuItems} />;
                    })}
                </Toolbar>
            </AppBar>);
    }
}

export default decorate<{ title: string, menuCommand?: MenuCommand, secondaryCommands?: MenuCommand[] }>(connect(
    (state: ApplicationState) => state.client,
    ClientStore.actionCreators
)(TopBar));
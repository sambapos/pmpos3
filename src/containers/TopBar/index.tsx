import * as React from 'react';
import { AppBar, Toolbar, Typography, WithStyles } from 'material-ui';
import classNames from 'classnames';
import decorate, { IStyle } from './style';
import * as ClientStore from '../../store/Client';
import { connect } from 'react-redux';
import { IApplicationState } from '../../store/index';
import MenuButton, { IMenuCommand } from './MenuButton';

interface ITopBarProps {
    title: string;
    menuCommand: IMenuCommand;
    secondaryCommands?: IMenuCommand[];
}

type Props =
    ITopBarProps
    & ClientStore.IClientState
    & typeof ClientStore.actionCreators
    & WithStyles<keyof IStyle>;

class TopBar extends React.Component<Props, {}> {
    public render() {
        const anchor = 'Left';
        const menuCommand = this.props.menuCommand
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
                        variant="title"
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

export default decorate<{ title: string, menuCommand?: IMenuCommand, secondaryCommands?: IMenuCommand[] }>(connect(
    (state: IApplicationState) => state.client,
    ClientStore.actionCreators
)(TopBar));
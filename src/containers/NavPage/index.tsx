import * as React from 'react';
import classNames from 'classnames';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import Typography from 'material-ui/Typography';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import List from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Hidden from 'material-ui/Hidden';
import Divider from 'material-ui/Divider';

import NavList from './navList';
import { subRoutes } from '../../routes';
import { RouteComponentProps } from 'react-router';
import { ListItem, ListItemText } from 'material-ui';

const drawerWidth = 240;

const decorate = withStyles(({ palette, spacing, breakpoints, mixins, transitions }) => ({
    root: {
        width: '100%',
        height: '100%',
        zIndex: 1,
        overflow: 'hidden' as 'hidden',
    },
    appFrame: {
        position: 'relative' as 'relative',
        display: 'flex',
        width: '100%',
        height: '100%',
    },
    appBar: {
        position: 'absolute' as 'absolute',
        transition: transitions.create(['margin', 'width'], {
            easing: transitions.easing.sharp,
            duration: transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        [breakpoints.down('md')]: {
            width: '100%',
        },
        transition: transitions.create(['margin', 'width'], {
            easing: transitions.easing.easeOut,
            duration: transitions.duration.enteringScreen,
        }),
    },
    'appBarShift-left': {
        marginLeft: drawerWidth,
    },
    'appBarShift-right': {
        marginRight: drawerWidth,
    },
    navIconHide: {
        [breakpoints.up('md')]: {
            display: 'none',
        },
    },
    drawerHeader: mixins.toolbar,
    drawerPaper: {
        width: 250,
        [breakpoints.up('md')]: {
            width: drawerWidth,
            // position: 'relative',
            height: '100%',
        },
    },
    content: {
        width: '100%',
        flexGrow: 1,
        backgroundColor: palette.background.contentFrame,
        padding: spacing.unit * 3,
        transition: transitions.create('margin', {
            easing: transitions.easing.sharp,
            duration: transitions.duration.leavingScreen,
        }),
        marginTop: 56,
        [breakpoints.up('md')]: {
            content: {
                height: 'calc(100% - 64px)',
                marginTop: 64,
            },
        },
    },
    contentShift: {
        transition: transitions.create('margin', {
            easing: transitions.easing.easeOut,
            duration: transitions.duration.enteringScreen,
        }),
    },
    'contentShift-left': {
        [breakpoints.up('md')]: {
            marginLeft: drawerWidth,
        }
    },
    'contentShift-right': {
        [breakpoints.up('md')]: {
            marginRight: drawerWidth,
        }
    },
}));

class NavPage extends React.Component<WithStyles<'root' | 'appFrame' | 'appBar'
    | 'appBarShift' | 'appBarShift-left' | 'appBarShift-right'
    | 'navIconHide' | 'drawerHeader' | 'drawerPaper' | 'content'
    | 'contentShift' | 'contentShift-left' | 'contentShift-right'> & RouteComponentProps<{}>> {
    state = {
        open: false,
        anchor: 'left'
    };

    handleDrawerToggle = () => {
        this.setState({ open: !this.state.open });
    }

    closeDrawer = () => {
        this.setState({ open: false });
    }

    render() {
        const { classes } = this.props;
        const { anchor, open } = this.state;
        const drawer = (
            <div>
                <div className={classes.drawerHeader} />
                <Divider />
                <NavList
                    history={this.props.history}
                    closeDrawer={this.closeDrawer}
                />
                <Divider />
                <List>
                    <ListItem
                        button
                        onClick={() => {
                            this.props.history.push('/about');
                            if (window.innerWidth < 1024) { this.handleDrawerToggle(); }
                        }}
                    >
                        <ListItemText primary="About" />
                    </ListItem>
                </List>
            </div>
        );

        return (
            <div className={classes.root}>
                <div className={classes.appFrame}>
                    <AppBar
                        className={classNames(classes.appBar, {
                            [classes.appBarShift]: open,
                            [classes[`appBarShift-${anchor}`]]: open,
                        })}
                    >
                        <Toolbar>
                            <IconButton
                                color="contrast"
                                aria-label="open drawer"
                                onClick={this.handleDrawerToggle}
                            >
                                <i className="material-icons">menu</i>
                            </IconButton>
                            <Typography type="title" color="inherit" noWrap>
                                PM-POS
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Hidden mdUp>
                        <Drawer
                            type="temporary"
                            anchor={'left'}
                            open={this.state.open}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            onRequestClose={this.handleDrawerToggle}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                    <Hidden smDown>
                        <Drawer
                            type="persistent"
                            open={this.state.open}
                            anchor="left"
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                    <main
                        className={classNames(classes.content, {
                            [classes.contentShift]: open,
                            [classes[`contentShift-${anchor}`]]: open,
                        })}
                    >
                        {subRoutes}
                    </main>

                </div>
            </div>
        );
    }
}

export default decorate<{}>(NavPage);
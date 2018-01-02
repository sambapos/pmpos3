import * as React from 'react';
import classNames from 'classnames';
import { WithStyles } from 'material-ui/styles/withStyles';
import Drawer from 'material-ui/Drawer';
import List from 'material-ui/List';
import Hidden from 'material-ui/Hidden';
import Divider from 'material-ui/Divider';

import NavList from './navList';
import { subRoutes } from '../../routes';
import { RouteComponentProps, Route } from 'react-router';
import { ListItem, ListItemText, Typography } from 'material-ui';
import decorate, { Style } from './style';

import * as ClientStore from '../../store/Client';
import { ApplicationState } from '../../store/index';
import { connect } from 'react-redux';
import LoginPage from '../LoginPage';

type NavPageProps = ClientStore.ClientState
    & WithStyles<keyof Style>
    & typeof ClientStore.actionCreators
    & RouteComponentProps<{}>;

class NavPage extends React.Component<NavPageProps> {
    state = {
        anchor: 'Left'
    };

    handleDrawerToggle = () => {
        this.props.ToggleDrawer();
    }

    closeDrawer = () => {
        this.props.ToggleDrawer(true);
    }

    render() {
        const { classes } = this.props;
        const { anchor } = this.state;
        const drawer = (
            <div>
                <div className={classes.drawerHeader} >
                    <Typography
                        type="title"
                        color="inherit"
                        className={classes.drawerCaption}
                    >
                        PM-POS 3.0
                    </Typography>
                </div>
                <Divider />
                <NavList
                    loggedInUser={this.props.loggedInUser}
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
                    <Hidden mdUp>
                        <Drawer
                            type="temporary"
                            anchor="left"
                            open={this.props.drawerOpen}
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
                            open={this.props.drawerOpen}
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
                            [classes.contentShift]: this.props.drawerOpen,
                            [classes[`contentShift${anchor}`]]: this.props.drawerOpen,
                        })}
                    >
                        {
                            this.props.loggedInUser
                                ? subRoutes
                                : <div style={{ height: '100%', display: 'flex' }}><Route component={LoginPage} /></div>
                        }
                    </main>

                </div>
            </div>
        );
    }
}
export default decorate(connect(
    (state: ApplicationState) => state.client,
    ClientStore.actionCreators
)(NavPage));
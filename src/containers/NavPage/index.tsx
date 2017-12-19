import * as React from 'react';
import classNames from 'classnames';
import { WithStyles } from 'material-ui/styles/withStyles';
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
import decorate, { Style } from './style';

type NavPageProps = WithStyles<keyof Style> & RouteComponentProps<{}>;

class NavPage extends React.Component<NavPageProps> {
    state = {
        open: false,
        anchor: 'Left'
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
                            [classes[`appBarShift${anchor}`]]: open,
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
                            anchor="left"
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
                            [classes[`contentShift${anchor}`]]: open,
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
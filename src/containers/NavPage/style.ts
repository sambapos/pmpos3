import { withStyles } from 'material-ui';

const drawerWidth = 240;

export interface Style {
    root: any;
    appFrame: any;
    appBar: any;
    appBarShift: any;
    appBarShiftLeft: any;
    appBarShiftRight: any;
    navIconHide: any;
    drawerHeader: any;
    drawerPaper: any;
    content: any;
    contentShift: any;
    contentShiftLeft: any;
    contentShiftRight: any;
}

export default withStyles(({ palette, spacing, breakpoints, mixins, transitions }): Style => ({
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
    appBarShiftLeft: {
        marginLeft: drawerWidth,
    },
    appBarShiftRight: {
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
        padding: spacing.unit,
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
        [breakpoints.up('sm')]: {
            padding: spacing.unit * 3,
        }
    },
    contentShift: {
        transition: transitions.create('margin', {
            easing: transitions.easing.easeOut,
            duration: transitions.duration.enteringScreen,
        }),
    },
    contentShiftLeft: {
        [breakpoints.up('md')]: {
            marginLeft: drawerWidth,
        }
    },
    contentShiftRight: {
        [breakpoints.up('md')]: {
            marginRight: drawerWidth,
        }
    },
}));
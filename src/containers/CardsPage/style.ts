import withStyles from 'material-ui/styles/withStyles';

export interface Style {
    card: any;
    content: any;
    root: any;
    formControl: any;
    search: any;
    draggableList: any;
    sectionList: any;
    tabBar: any;
}

export default withStyles(({ palette, spacing, breakpoints }): Style => ({
    tabBar: {
        flex: 'none',
        [breakpoints.up('sm')]: {
            maxWidth: '600px',
            width: '100%',
            alignSelf: 'center'
        }
    },
    draggableList: {
        overflow: 'auto',
        backgroundColor: palette.background.paper
    },
    sectionList: {
        padding: 0,
        backgroundColor: palette.background.paper
    },
    card: {
        minWidth: 275,
    },
    search: {
        [breakpoints.up('sm')]: {
            maxWidth: '600px',
            width: '100%',
            alignSelf: 'center',
            marginBottom: spacing.unit * 3
        }
    },
    root: {
        display: 'flex',
        flexFlow: 'column',
        flex: '1 1 auto'
    },
    content: {
        height: '100%',
        display: 'flex',
        flex: 1,
        flexFlow: 'column',
        [breakpoints.up('sm')]: {
            maxWidth: '600px',
            width: '100%',
            alignSelf: 'center'
        },
    },
    formControl: {
        margin: spacing.unit,
        display: 'grid',
        minWidth: 120,
    },
}));
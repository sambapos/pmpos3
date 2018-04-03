import withStyles from 'material-ui/styles/withStyles';

export interface Style {
    content: any;
    paper: any;
    root: any;
    footer: any;
    fixedEdit: any;
    list: any;
}

export default withStyles(({ palette, spacing, breakpoints }): Style => ({
    root: {
        display: 'flex',
        flexFlow: 'column',
        flex: '1 1 auto'
    },
    list: {
        flex: 1,
        overflow: 'auto',
        marginTop: spacing.unit
    },
    content: {
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        flexFlow: 'column',
        padding: spacing.unit,
        marginTop: spacing.unit,
        [breakpoints.up('sm')]: {
            maxWidth: 600,
            width: '100%',
            alignSelf: 'center',
            padding: spacing.unit * 3,
            marginTop: spacing.unit * 3
        },
    },
    footer: {
        [breakpoints.up('sm')]: {
            maxWidth: '600px',
            width: '100%',
            alignSelf: 'center',
        },
        flex: 'none'
    },
    paper: {
        display: 'flex',
        overflowX: 'auto',
        flexFlow: 'column',
        padding: spacing.unit,
        flex: 'none',
        [breakpoints.up('sm')]: {
            maxWidth: 600,
            width: '100%',
            alignSelf: 'center',
            padding: spacing.unit * 3,
        },
    },
    fixedEdit: {
        fontFamily: `Consolas, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Courier New, monospace`
    }
}));
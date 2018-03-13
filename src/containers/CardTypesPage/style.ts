import withStyles from 'material-ui/styles/withStyles';

export interface Style {
    card: any;
    content: any;
    paper: any;
    root: any;
}

export default withStyles(({ palette, spacing, breakpoints }): Style => ({
    card: {
        minWidth: 275,
    },
    root: {
        display: 'flex',
        flexFlow: 'column',
        flex: '1 1 auto'
    },
    content: {
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        flexFlow: 'column',
        [breakpoints.up('sm')]: {
            width: '100%',
            maxWidth: 600,
            alignSelf: 'center'
        },
    },
    paper: {
        [breakpoints.down('sm')]: {
            marginTop: spacing.unit * 3,
        },
        [breakpoints.up('sm')]: {
            marginLeft: spacing.unit * 3,
        },

        flex: '1 1 auto',
        overflowX: 'auto' as 'auto',
    }
}));
import withStyles from 'material-ui/styles/withStyles';

export interface Style {
    card: any;
    content: any;
    footer: any;
    root: any;
    amount: any;
}

export default withStyles(({ palette, spacing, breakpoints }): Style => ({
    card: {
        minWidth: 275,
    },
    amount: {
        minWidth: 75,
        textAlign: 'right',
        [breakpoints.down('xs')]: {
            minWidth: 50,
        },
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
            maxWidth: '600px',
            width: '100%',
            alignSelf: 'center',
        },
        [breakpoints.down('xs')]: {
            fontSize: '0.8em',
        }
    },
    footer: {
        [breakpoints.up('sm')]: {
            maxWidth: '600px',
            alignSelf: 'center',
        },
        width: '100%',
        flex: 'none',
        display: 'flex',
        flexFlow: 'column'
    }
}));
import withStyles from '@material-ui/core/styles/withStyles';

export interface IStyle {
    card: any;
    content: any;
    paper: any;
    root: any;
}

export default withStyles(({ palette, spacing, breakpoints }): IStyle => ({
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
            width: '600px',
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
import withStyles from 'material-ui/styles/withStyles';

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
        [breakpoints.down('sm')]: {
            flexFlow: 'column'
        },
        [breakpoints.up('md')]: {
            maxWidth: '900px',
            width: '100%',
            alignSelf: 'center'
        },
    },
    paper: {
        [breakpoints.down('sm')]: {
            marginTop: spacing.unit,
        },
        [breakpoints.up('sm')]: {
            marginLeft: spacing.unit * 2,
        },

        flex: '1 1 auto',
        overflowX: 'auto' as 'auto',
    }
}));
import withStyles from 'material-ui/styles/withStyles';

export interface Style {
    card: any;
    content: any;
    paper: any;
    blockTags: any;
}

export default withStyles(({ palette, spacing, breakpoints }): Style => ({
    blockTags: {
        display: 'inline-flex'
    },
    card: {
        minWidth: 275,
    },
    content: {
        height: '100%',
        display: 'flex',
        [breakpoints.down('sm')]: {
            flexFlow: 'column'
        },
        [breakpoints.up('md')]: {
            width: '900px',
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
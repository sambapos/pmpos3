import withStyles from 'material-ui/styles/withStyles';

export interface Style {
    card: any;
    content: any;
    paper: any;
    blockTags: any;
    blockTag: any;
}

export default withStyles(({ palette, spacing, breakpoints }): Style => ({
    blockTags: {
        display: 'inline-flex',
        flexWrap: 'wrap'
    },
    blockTag: {
        marginBottom: spacing.unit,
        marginRight: spacing.unit
    },
    card: {
        minWidth: 275,
    },
    content: {
        height: '100%',
        width: '100%',
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
            marginTop: spacing.unit,
            width: '100%'
        },
        [breakpoints.up('sm')]: {
            marginLeft: spacing.unit * 3,
        },
        padding: spacing.unit
    }
}));
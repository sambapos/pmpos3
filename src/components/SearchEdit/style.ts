import withStyles from 'material-ui/styles/withStyles';

export interface Style {
    editor: any;
    containter: any;
}

export default withStyles(({ palette, spacing, breakpoints }): Style => ({
    containter: {
        display: 'flex',
        [breakpoints.up('sm')]: {
            padding: spacing.unit / 2,
        },
    },
    editor: {
        margin: 0,
        flex: 1,
    }
}));
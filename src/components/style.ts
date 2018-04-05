import withStyles from 'material-ui/styles/withStyles';

export interface Style {
    list: any;
}

export default withStyles(({ palette, spacing, breakpoints }): Style => ({
    list: {
        flex: 1,
        overflow: 'auto',
        marginTop: spacing.unit
    }
}));
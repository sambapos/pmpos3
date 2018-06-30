import withStyles from '@material-ui/core/styles/withStyles';

export interface IStyle {
    section: any;
    contentRoot: any;
    contentTitle: any;
}

export default withStyles(({ palette, spacing, breakpoints }): IStyle => ({
    section: {
        margin: spacing.unit / 2,
        marginBottom: spacing.unit
    },
    contentRoot: {
        [breakpoints.down('xs')]: {
            '&:first-child': {
                paddingTop: spacing.unit
            },
            paddingTop: 0,
            paddingLeft: spacing.unit,
            paddingRight: spacing.unit,
            paddingBottom: spacing.unit,
        },
    },
    contentTitle: {
        [breakpoints.down('xs')]: {
            padding: spacing.unit
        },
    }
}));
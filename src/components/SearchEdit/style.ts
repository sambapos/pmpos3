import withStyles from '@material-ui/core/styles/withStyles';

export interface IStyle {
    editor: any;
    containter: any;
}

export default withStyles(({ palette, spacing, breakpoints }): IStyle => ({
    containter: {
        display: 'flex',
        flex: 'none',
        [breakpoints.up('sm')]: {
            padding: spacing.unit / 2,
        },
    },
    editor: {
        margin: 0,
        flex: 1,
    }
}));
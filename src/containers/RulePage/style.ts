import withStyles from '@material-ui/core/styles/withStyles';

export interface IStyle {
    content: any;
    root: any;
    footer: any;
    editor: any;
}

export default withStyles(({ palette, spacing, breakpoints }): IStyle => ({
    editor: {
        flex: 1,
        width: 'auto',
        marginTop: spacing.unit
    },
    root: {
        display: 'flex',
        flexFlow: 'column',
        flex: '1 1 auto',
        padding: spacing.unit
    },
    content: {
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        flexFlow: 'column',
        padding: spacing.unit,
        [breakpoints.up('sm')]: {
            padding: spacing.unit * 3
        },
        [breakpoints.up('md')]: {
            width: '900px',
            alignSelf: 'center'
        },
    },
    footer: {
        [breakpoints.up('md')]: {
            maxWidth: '900px',
            width: '100%',
            alignSelf: 'center',
        },
        flex: 'none'
    }
}));
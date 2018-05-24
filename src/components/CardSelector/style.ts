import withStyles from '@material-ui/core/styles/withStyles';

export interface IStyle {
    content: any;
    container: any;
}

export default withStyles(({ palette, spacing, breakpoints }): IStyle => ({
    content: {
        height: '100%',
        display: 'flex',
        flexFlow: 'column',
        [breakpoints.up('sm')]: {
            maxWidth: '600px'
        },
    },
    container: {
        flex: 1,
        flexWrap: 'wrap',
        display: 'flex',
        overflow: 'auto',
        backgroundColor: palette.background.paper,
        [breakpoints.down('xs')]: {
            paddingTop: 2,
        },
        [breakpoints.up('sm')]: {
            padding: spacing.unit / 2
        },
    }
}));
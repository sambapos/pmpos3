import withStyles from 'material-ui/styles/withStyles';

export interface Style {
    content: any;
    container: any;
    button: any;
    highlightedButton: any;
}

export default withStyles(({ palette, spacing, breakpoints }): Style => ({
    content: {
        flex: '1',
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
    },
    button: {
        flex: '1 1 auto',
        margin: 2,
        fontSize: '1.4em',
        maxWidth: '48.5%',
        maxHeight: '50%',
        [breakpoints.up('sm')]: {
            margin: 4,
            minWidth: 100
        },
    },
    highlightedButton: {

    }
}));
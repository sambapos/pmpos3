import withStyles from 'material-ui/styles/withStyles';

export interface Style {
    commandButtonsContainer: any;
    button: any;
    highlightedButton: any;
}

export default withStyles(({ palette, spacing, breakpoints }): Style => ({
    commandButtonsContainer: {
        flex: 'none',
        display: 'flex',
        flexWrap: 'wrap',
        [breakpoints.up('sm')]: {
            marginLeft: (spacing.unit * 2) - 4
        }
    },
    button: {
        flex: 1,
        margin: 2,
        [breakpoints.up('sm')]: {
            margin: 0,
            fontSize: '1.2em',
            minHeight: 70,
            minWidth: 150,
            marginLeft: 4,
            marginBottom: 4
        },
    },
    highlightedButton: {

    }
}));
import withStyles from 'material-ui/styles/withStyles';

export interface Style {
    button: any;
    highlightedButton: any;
}

export default withStyles(({ palette, spacing, breakpoints }): Style => ({
    button: {
        margin: 2,
        [breakpoints.up('sm')]: {
            margin: 0,
            marginLeft: 4,
            marginBottom: 4
        },
    },
    highlightedButton: {

    }
}));
import withStyles from '@material-ui/core/styles/withStyles';

export interface IStyle {
    commandButtonsContainer: any;
    button: any;
    highlightedButton: any;
}

export default withStyles(({ spacing, breakpoints }): IStyle => ({
    commandButtonsContainer: {
        flex: 'none',
        display: 'flex',
        flexWrap: 'wrap',
        [breakpoints.down('xs')]: {
            margin: 2,
        },
        [breakpoints.up('sm')]: {
            marginLeft: (spacing.unit * 2) - 4
        }
    },
    button: {
        flex: 1,
        margin: 2,
        [breakpoints.down('xs')]: {
            boxShadow: 'none',
        },
        [breakpoints.up('sm')]: {
            margin: 4,
            fontSize: '1.2em',
            minHeight: 70,
            minWidth: 130,
            marginLeft: 4,
            marginBottom: 4
        },
        [breakpoints.up('md')]: {
            minWidth: 'calc(25% - 8px)',
        },
        [breakpoints.up('lg')]: {
            minWidth: 'calc(20% - 8px)',
            maxWidth: 'calc(20% - 8px)',
        }
    },
    highlightedButton: {

    }
}));
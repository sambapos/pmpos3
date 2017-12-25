import { withStyles } from 'material-ui';
import { red, green } from 'material-ui/colors';

export interface Style {
    root: any;
    content: any;
    pinEdit: any;
    pinEditInput: any;
    loginButton: any;
    loginControl: any;
    buttonRow: any;
    redButton: any;
    greenButton: any;
}

export default withStyles(({ palette, spacing, breakpoints, mixins, transitions }): Style => ({
    root: {
        display: 'flex',
        flexFlow: 'column',
        flex: '1 1 auto'
    },
    pinEdit: {
        width: '100%',
        paddingTop: spacing.unit * 2,
        paddingBottom: spacing.unit * 2
    },
    pinEditInput: {
        fontSize: 20
    },
    loginControl: {
        padding: spacing.unit * 2,
        display: 'flex',
        flexFlow: 'column'
    },
    loginButton: {
        margin: spacing.unit / 2,
        fontSize: 24,
        lineHeight: 1,
        padding: spacing.unit * 2
    },
    redButton: {
        margin: spacing.unit / 2,
        fontSize: 24,
        lineHeight: 1,
        color: 'white',
        background: red[500]
    },
    greenButton: {
        margin: spacing.unit / 2,
        fontSize: 24,
        lineHeight: 1,
        color: 'white',
        background: green[500]
    },
    buttonRow: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    content: {
        overflowY: 'auto',
        flex: '0 0 90%',
        display: 'flex',
        flexFlow: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    }
}));
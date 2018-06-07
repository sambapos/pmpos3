import { withStyles } from '@material-ui/core';

export interface IStyle {
    root: any;
    content: any;
    card: any;
}

export default withStyles(({ palette, spacing, breakpoints, mixins, transitions }): IStyle => ({
    root: {
        display: 'flex',
        flexFlow: 'column',
        flex: '1 1 auto'
    },
    content: {
        overflowY: 'auto',
        flex: '1 1 auto'
    },
    card: {
        marginBottom: 8
    }
}));
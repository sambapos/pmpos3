import * as React from 'react';
import JssProvider from 'react-jss/lib/JssProvider';
import { withStyles, MuiThemeProvider } from 'material-ui/styles';
import { wrapDisplayName } from 'recompose';
import createContext from '../../styles/createContext';
import { RouteComponentProps } from 'react-router';

interface RootProps {
    children: JSX.Element;
}

type Props = RootProps & RouteComponentProps<{}>;

// Apply some reset
const decorate = withStyles(theme => ({
    '@global': {
        html: {
            background: theme.palette.background.default,
            WebkitFontSmoothing: 'antialiased', // Antialiasing.
            MozOsxFontSmoothing: 'grayscale', // Antialiasing.
        },
        body: {
            margin: 0,
        },
    },
}));

const AppWrapper = decorate<Props>(props => props.children);

const context = createContext();

function withRoot(BaseComponent: React.ComponentType<RouteComponentProps<{}> & any>) {
    class WithRoot extends React.Component<RouteComponentProps<{}>> {
        componentDidMount() {
            // Remove the server-side injected CSS.
            const jssStyles = document.querySelector('#jss-server-side');
            if (jssStyles && jssStyles.parentNode) {
                jssStyles.parentNode.removeChild(jssStyles);
            }
        }

        render() {
            return (
                <JssProvider
                    registry={context.sheetsRegistry}
                    jss={context.jss}
                >
                    <MuiThemeProvider theme={context.theme} sheetsManager={context.sheetsManager} >
                        <AppWrapper
                            match={this.props.match}
                            location={this.props.location}
                            history={this.props.history}
                        >
                            <BaseComponent
                                children={this.props.children}
                                match={this.props.match}
                                location={this.props.location}
                                history={this.props.history}
                            />
                        </AppWrapper>
                    </MuiThemeProvider>
                </JssProvider>
            );
        }
    }

    if (process.env.NODE_ENV !== 'production') {
        (WithRoot as any).displayName = wrapDisplayName(BaseComponent, 'withRoot');
    }

    return WithRoot;
}

export default withRoot;
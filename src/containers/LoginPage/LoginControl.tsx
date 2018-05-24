import * as React from 'react';
import { TextField, WithStyles } from '@material-ui/core';
import decorate, { IStyle } from './style';
import LoginButton from './LoginButton';

interface ILoginPageState {
    pin: string;
}

interface ILoginPageProps {
    onPinEntered: (pin: string) => void;
    captureKeys: boolean;
}

type PageProps = ILoginPageProps & WithStyles<keyof IStyle>;

class LoginControl extends React.Component<PageProps, ILoginPageState> {
    public state = { pin: '' };

    constructor(props: PageProps) {
        super(props);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    public componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown, false);
    }

    public componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown, false);
    }

    public render() {

        return (
            <div className={this.props.classes.loginControl} >
                <TextField
                    className={this.props.classes.pinEdit}
                    placeholder="Enter PIN"
                    value={this.state.pin}
                    InputProps={{
                        classes: {
                            input: this.props.classes.pinEditInput
                        }
                    }}

                />
                <div className={this.props.classes.buttonRow}>
                    <LoginButton value="1" onClick={v => this.handleClick(v)} />
                    <LoginButton value="2" onClick={v => this.handleClick(v)} />
                    <LoginButton value="3" onClick={v => this.handleClick(v)} />
                </div>
                <div className={this.props.classes.buttonRow}>
                    <LoginButton value="4" onClick={v => this.handleClick(v)} />
                    <LoginButton value="5" onClick={v => this.handleClick(v)} />
                    <LoginButton value="6" onClick={v => this.handleClick(v)} />
                </div>
                <div className={this.props.classes.buttonRow}>
                    <LoginButton value="7" onClick={v => this.handleClick(v)} />
                    <LoginButton value="8" onClick={v => this.handleClick(v)} />
                    <LoginButton value="9" onClick={v => this.handleClick(v)} />
                </div>
                <div className={this.props.classes.buttonRow}>
                    <LoginButton value="close" icon="close" onClick={x => this.setState({ pin: '' })} />
                    <LoginButton value="0" onClick={v => this.handleClick(v)} />
                    <LoginButton value=">" icon="keyboard_return" onClick={v => this.handleSubmit()} />
                </div>
            </div>
        );
    }

    private handleClick(value: string) {
        this.setState({ pin: this.state.pin + value });
    }

    private handleSubmit() {
        const pin = this.state.pin;
        this.setState({ pin: '' });
        this.props.onPinEntered(pin);
    }

    private handleKeyDown = (event) => {
        if (!this.props.captureKeys) {
            return;
        }
        if ('1234567890'.indexOf(event.key) !== -1) {
            this.handleClick(event.key);
            event.preventDefault();
        } else if (event.key === 'Enter') {
            this.handleSubmit();
        }
    }
}

export default decorate(LoginControl);
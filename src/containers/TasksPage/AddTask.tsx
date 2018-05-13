import * as React from 'react';
import { Card, CardContent, Typography, TextField, Button, WithStyles } from 'material-ui';
import decorate, { IStyle } from './style';

interface IAddTaskProps {
    addTask: (title: string) => void;
}

type Props = IAddTaskProps & WithStyles<keyof IStyle>;

class AddTask extends React.Component<Props, { title: string }> {
    public state = { title: '' };

    public render() {
        return (
            <Card className={this.props.classes.card}>
                <CardContent>
                    <Typography variant="headline">
                        Add a Task
                        </Typography>
                    <TextField
                        required
                        id="required"
                        label="Enter Task Title"
                        margin="normal"
                        value={this.state.title}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                this.addTask();
                            }
                        }}
                        onChange={(e) => this.setState({ title: e.target.value })}
                    />
                    <Button
                        disabled={!this.state.title}
                        onClick={() => this.addTask()}
                    >Add
                    </Button>
                </CardContent>
            </Card>
        );
    }

    private addTask() {
        this.props.addTask(this.state.title);
        this.setState({ title: '' });
    }
}

export default decorate(AddTask);
import * as React from 'react';
import { Card, CardContent, Typography, TextField, Button, WithStyles } from 'material-ui';
import decorate, { Style } from './style';

interface AddTaskProps {
    addTask: (title: String) => void;
}

type Props = AddTaskProps & WithStyles<keyof Style>;

class AddTask extends React.Component<Props, { title: string }> {
    state = { title: '' };

    addTask() {
        this.props.addTask(this.state.title);
        this.setState({ title: '' });
    }

    render() {
        return (
            <Card className={this.props.classes.card}>
                <CardContent>
                    <Typography type="headline">
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
}

export default decorate(AddTask);
import * as React from 'react';
import * as _ from 'lodash';
import { FormControl, InputLabel, Input, InputAdornment, IconButton, Icon } from 'material-ui';
import { WithStyles } from 'material-ui/styles/withStyles';
import decorate, { IStyle } from './style';

interface ISearchEditProps {
    value: string;
    debounce?: number;
    onChange: (value: string) => void;
}

interface ISearchEditState {
    value: string;
}

class SearchEdit extends React.Component<ISearchEditProps & WithStyles<keyof IStyle>, ISearchEditState> {
    private debouncedChange;
    private input;

    constructor(props: ISearchEditProps & WithStyles<keyof IStyle>) {
        super(props);
        this.state = { value: props.value };
    }
    public componentWillMount() {
        this.debouncedChange = _.debounce(this.props.onChange, this.props.debounce || 200);
    }
    public componentWillReceiveProps(nextProps: ISearchEditProps) {
        if (nextProps.value !== this.props.value) {
            this.setState({ value: nextProps.value });
        }
    }
    public render() {
        return <div className={this.props.classes.containter}>
            <FormControl className={this.props.classes.editor}>
                <InputLabel>Search</InputLabel>
                <Input
                    fullWidth
                    value={this.state.value}
                    inputRef={r => this.input = r}
                    onChange={e => {
                        this.setState({ value: e.target.value });
                        this.debouncedChange(e.target.value);
                    }}
                    endAdornment={
                        <InputAdornment position="end">
                            {this.props.value && <IconButton
                                aria-label="Clear search text"
                                onClick={() => {
                                    this.setState({ value: '' });
                                    this.props.onChange('');
                                    this.input.blur();
                                }}
                                onMouseDown={e => e.preventDefault()}
                            >
                                <Icon>close</Icon>
                            </IconButton>}
                        </InputAdornment >
                    }
                />
            </FormControl>
        </div>;
    }
}

export default decorate(SearchEdit);
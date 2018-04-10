import * as React from 'react';
import * as Autosuggest from 'react-autosuggest';
import { TextField, Paper, MenuItem } from 'material-ui';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { WithStyles } from 'material-ui/styles/withStyles';
import decorate, { Style } from './style';

export interface Suggestion {
    label: string;
}

function renderInput(inputProps: any) {
    const { classes, autoFocus, value, ref, label, ...other } = inputProps;

    return (
        <TextField
            label={label}
            autoFocus={autoFocus}
            className={classes.textField}
            value={value}
            inputRef={ref}
            InputProps={{
                classes: {
                    input: classes.input,
                },
                ...other,
            }}
        />
    );
}

function renderSuggestion(suggestion: Suggestion, { query, isHighlighted }: { query: string, isHighlighted: boolean }) {
    const matches = match(getSuggestionValue(suggestion), query);
    const parts = parse(getSuggestionValue(suggestion), matches);

    return (
        <MenuItem selected={isHighlighted} component="div">
            <div>
                {parts.map((part, index) => {
                    return part.highlight ? (
                        <span key={String(index)} style={{ fontWeight: 300 }}>
                            {part.text}
                        </span>
                    ) : (
                            <strong key={String(index)} style={{ fontWeight: 500 }}>
                                {part.text}
                            </strong>
                        );
                })}
            </div>
        </MenuItem>
    );
}

function renderSuggestionsContainer(options: { containerProps: any, children: any }) {
    const { containerProps, children } = options;

    return (
        <Paper {...containerProps} square style={{ zIndex: 1 }}>
            {children}
        </Paper>
    );
}

function getSuggestionValue(suggestion: Suggestion) {
    return suggestion.label;
}

interface SuggestProps {
    getSuggestions: (value: string) => Suggestion[];
    handleChange: (event: any, newValue: string) => void;
    value: string;
    label: string;
}

interface SuggestState {
    value: string;
    suggestions: Suggestion[];
}

type Props = SuggestProps & WithStyles<keyof Style>;

class AutoSuggest extends React.Component<Props, SuggestState> {

    constructor(props: Props) {
        super(props);
        this.state = {
            value: props.value,
            suggestions: [],
        };
    }

    handleSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: this.props.getSuggestions(value),
        });
    }

    handleSuggestionsClearRequested = () => {
        this.setState({
            suggestions: [],
        });
    }

    handleChange = (event, { newValue }) => {
        this.setState({
            value: newValue,
        });
        this.props.handleChange(event, newValue);
    }

    componentWillReceiveProps(props: any) {
        if (props.value !== this.state.value) {
            this.setState({ value: props.value });
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <Autosuggest
                theme={{
                    container: classes.container,
                    suggestionsContainerOpen: classes.suggestionsContainerOpen,
                    suggestionsList: classes.suggestionsList,
                    suggestion: classes.suggestion,
                }}
                renderInputComponent={renderInput}
                suggestions={this.state.suggestions}
                onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
                renderSuggestionsContainer={renderSuggestionsContainer}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={{
                    classes,
                    label: this.props.label,
                    value: this.state.value,
                    onChange: this.handleChange,
                }}
            />
        );
    }
}

export default decorate(AutoSuggest);
import * as React from 'react';
import { connect } from 'react-redux';
import * as ConfigStore from '../../store/Config';
import { RouteComponentProps } from 'react-router';
import { WithStyles, TextField, Paper } from '@material-ui/core';
import decorate, { IStyle } from './style';
import { IApplicationState } from '../../store/index';
import TopBar from '../TopBar';
import AceEditor from 'react-ace';
import * as beautify from 'js-beautify';

import 'brace/mode/ruby';
import 'brace/theme/xcode';
import 'brace/ext/language_tools';
import 'brace/snippets/drools';
import { RuleRecord } from 'pmpos-core';

type PageProps =
    {
        isLoading: boolean
        rule: RuleRecord
    }
    & WithStyles<keyof IStyle>
    & typeof ConfigStore.actionCreators
    & RouteComponentProps<{ id?: string }>;

export class RulePage extends React.Component<PageProps, { rule: RuleRecord }> {
    constructor(props: PageProps) {
        super(props);
        this.state = { rule: new RuleRecord() };
    }

    public componentWillReceiveProps(props: PageProps) {
        if (!props.isLoading) {
            this.setState({ rule: props.rule });
        }
    }

    public componentWillMount() {
        if (!this.props.isLoading && this.props.rule) {
            this.setState({ rule: this.props.rule });
        }
    }

    public render() {
        if (this.props.isLoading || !this.props.rule) { return <div>Loading</div>; }

        return (
            <div className={this.props.classes.root}>
                <TopBar
                    title={this.getTitle()}
                    menuCommand={{ icon: 'close', onClick: () => { this.props.history.goBack(); } }}
                    secondaryCommands={[
                        {
                            icon: 'format_line_spacing', onClick: () => {
                                this.setState({
                                    rule: new RuleRecord({
                                        id: this.state.rule.id,
                                        name: this.state.rule.name,
                                        content: beautify.js(this.state.rule.content)
                                    })
                                });
                            }
                        },
                        {
                            icon: 'delete',
                            menuItems: [{
                                icon: 'Confirm',
                                onClick: () => {
                                    this.props.deleteRule(this.state.rule.id);
                                    this.props.history.goBack();
                                }
                            }]
                        },
                        {
                            icon: 'check', onClick: () => {
                                this.props.saveRule(this.state.rule);
                                this.props.history.goBack();
                            }
                        }
                    ]}
                />
                <Paper className={this.props.classes.content}>
                    <TextField
                        label="Rule Name"
                        value={this.state.rule.name}
                        onChange={(e) => this.setState({
                            rule: this.state.rule.set('name', e.target.value)
                        })}
                    />
                    <AceEditor
                        mode="ruby"
                        theme="xcode"
                        name="jsonEdit"
                        height="auto"
                        width="auto"
                        className={this.props.classes.editor}
                        onChange={(e) => this.setState({
                            rule: this.state.rule.set('content', e)
                        })}
                        editorProps={{
                            $blockScrolling: Infinity
                        }}
                        fontSize={14}
                        showPrintMargin={false}
                        showGutter={true}
                        highlightActiveLine={true}
                        value={this.state.rule.content}
                        setOptions={{
                            enableBasicAutocompletion: true,
                            enableLiveAutocompletion: true,
                            enableSnippets: true,
                            showLineNumbers: true,
                            tabSize: 2,
                        }} />
                </Paper >
            </div>
        );
    }

    private getTitle() {
        return this.props.rule.name ? `Rule (${this.props.rule.name})` : 'New Rule';
    }
}

const mapStateToProps = (state: IApplicationState) => ({
    rule: state.config.currentRule,
    isLoading: state.config.isLoading
});

export default decorate(connect(
    mapStateToProps,
    ConfigStore.actionCreators
)(RulePage));
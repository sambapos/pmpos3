import * as React from 'react';
import { connect } from 'react-redux';
import * as ConfigStore from '../../store/Config';
import { RouteComponentProps } from 'react-router';
import { WithStyles, List, ListItem, Paper } from 'material-ui';
import decorate, { Style } from './style';
import { ApplicationState } from '../../store/index';
import { Map as IMap } from 'immutable';
import TopBar from '../TopBar';
import Divider from 'material-ui/Divider/Divider';
import ListItemText from 'material-ui/List/ListItemText';
import { TagTypeRecord } from 'pmpos-models';

type PageProps =
    { tagTypes: IMap<string, TagTypeRecord> }
    & WithStyles<keyof Style>
    & typeof ConfigStore.actionCreators
    & RouteComponentProps<{}>;

class TagTypesPage extends React.Component<PageProps, {}> {

    getSecondaryCommands() {
        let result = [
            {
                icon: 'add', onClick: () => {
                    this.props.history.push(process.env.PUBLIC_URL + '/tagType');
                    this.props.addTagType();
                }
            }
        ];
        return result;
    }

    renderTags(tagTypes: TagTypeRecord[]) {
        return tagTypes.sort((x, y) => x.name > y.name ? 1 : -1).map(tagType => {
            return tagType && (
                <div key={tagType.id}>
                    <ListItem
                        button
                        onClick={(e) => {
                            this.props.history.push(process.env.PUBLIC_URL + '/tagType');
                            this.props.loadTagType(tagType.id);
                            e.preventDefault();
                        }}
                    >
                        <ListItemText
                            primary={tagType.name}
                            secondary={tagType.id}
                        />
                    </ListItem>
                    <Divider />
                </div>
            );
        });
    }

    public render() {
        return (
            <div className={this.props.classes.root}>
                <TopBar
                    title="Tag Types"
                    secondaryCommands={this.getSecondaryCommands()}
                />

                <Paper className={this.props.classes.content}>
                    <List>
                        {this.renderTags(this.props.tagTypes.valueSeq().toArray())}
                    </List>
                </Paper>
            </div>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    tagTypes: state.config.tagTypes,
});

export default decorate(connect(
    mapStateToProps,
    ConfigStore.actionCreators
)(TagTypesPage));
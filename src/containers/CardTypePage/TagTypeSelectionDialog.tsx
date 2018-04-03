import * as React from 'react';
import { List as IList } from 'immutable';
import { DialogTitle, DialogContent, List, ListItem, Checkbox, DialogActions, Button, ListItemText } from 'material-ui';
import CardList from '../../modules/CardList';

export default class extends React.Component<{
    tagTypes: string[],
    onSubmit: (items: string[]) => void;
}, { selectedTagTypes: IList<string> }> {

    constructor(props: any) {
        super(props);
        this.state = { selectedTagTypes: IList<string>(props.tagTypes) };
    }

    handleToggleSelectTagType(id: string) {
        let items = this.state.selectedTagTypes;
        let checked = items.indexOf(id) !== -1;
        if (!checked) {
            items = items.push(id);
        } else {
            items = items.splice(items.indexOf(id), 1);
        }
        this.setState({ selectedTagTypes: items });
    }

    render() {
        return (<>
            <DialogTitle>Select Tag Types</DialogTitle>
            <DialogContent>
                <List>
                    {CardList.tagTypes.valueSeq().sort((x, y) => x.name > y.name ? 1 : 0).map(tt => {
                        let checked = this.state.selectedTagTypes.indexOf(tt.id) !== -1;
                        return <ListItem
                            key={tt.id + '.'}
                            disableGutters
                            button
                            onClick={e => this.handleToggleSelectTagType(tt.id)}
                        >
                            <Checkbox
                                style={{ height: 0 }}
                                checked={checked}
                                tabIndex={-1}
                                disableRipple
                                onChange={e => this.handleToggleSelectTagType(tt.id)}
                            />
                            <ListItemText primary={tt.name} />
                        </ListItem>;
                    }).toArray()}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={e => {
                    this.props.onSubmit(this.state.selectedTagTypes.toArray());
                }}>Submit</Button>
            </DialogActions>
        </>);
    }
}
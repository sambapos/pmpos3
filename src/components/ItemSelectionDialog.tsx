import * as React from 'react';
import { List as IList } from 'immutable';
import { DialogTitle, DialogContent, List, ListItem, Checkbox, DialogActions, Button, ListItemText } from 'material-ui';
import { Identifyable } from './Identifyable';

interface ItemSelectionProps {
    sourceItems: Identifyable[];
    selectedItems: string[];
    onSubmit: (selectedItems: string[]) => void;
}

export default class extends React.Component<ItemSelectionProps,
    { selectedItems: IList<string> }> {

    constructor(props: any) {
        super(props);
        this.state = { selectedItems: IList<string>(props.selectedItems) };
    }

    public render() {
        return (<>
            <DialogTitle>Select Tag Types</DialogTitle>
            <DialogContent>
                <List>
                    {this.props.sourceItems.sort((x, y) => x.name > y.name ? 1 : 0).map(tt => {
                        const checked = this.state.selectedItems.indexOf(tt.id) !== -1;
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
                    })}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={e => {
                    this.props.onSubmit(this.state.selectedItems.toArray());
                }}>Submit</Button>
            </DialogActions>
        </>);
    }

    private handleToggleSelectTagType(id: string) {
        let items = this.state.selectedItems;
        const checked = items.indexOf(id) !== -1;
        if (!checked) {
            items = items.push(id);
        } else {
            items = items.splice(items.indexOf(id), 1);
        }
        this.setState({ selectedItems: items });
    }

}
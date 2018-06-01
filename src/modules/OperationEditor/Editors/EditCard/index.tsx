import * as React from 'react';
import { Button, DialogContent, DialogActions, DialogTitle } from '@material-ui/core';
import IEditorProperties from '../editorProperties';
import { CardRecord, CardManager, ConfigManager } from 'pmpos-core';
import extract from '../CardExtractor';
import SectionComponent from '../SectionComponent';

type IProps = IEditorProperties<{}>;

export default class EditCard extends React.Component<IProps> {
    private baseCard: CardRecord | undefined;
    private baseParameters;

    constructor(props: IProps) {
        super(props);
        this.baseCard = this.getBaseCard(props.card);
        if (this.baseCard) {
            this.baseParameters = extract(this.baseCard);
            this.baseParameters = this.setSelectedItems(this.baseParameters, props.card);
        }
    }

    public render() {
        return (
            <>
                <DialogTitle>Edit Card</DialogTitle>
                <DialogContent>
                    {this.props.card.id}
                    <hr />
                    {this.props.card.allTags.map(v => (<div>{v.name},{v.valueDisplay},{v.cardId}</div>))}
                    <hr />
                    {this.baseCard && this.baseCard.name}
                    <hr />
                    {this.getSections()}
                </DialogContent>
                <DialogActions>
                    {/* <Button onClick={() => this.props.cancel()}>Cancel</Button> */}
                    <Button
                        onClick={(e) => {
                            this.props.success(this.props.actionName, {});
                        }}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </>
        );
    }

    private getSection(key: string, section: any) {
        return <SectionComponent
            name={key}
            values={section.values}
            selected={section.selected}
            onChange={x => x}
        />
    }

    private getSections() {
        const keys = Object.keys(this.baseParameters);
        return keys.map(key => this.getSection(key, this.baseParameters[key]))
    }

    private getBaseCard(card: CardRecord): CardRecord | undefined {
        let refCard: CardRecord | undefined;
        card.allTags.some(t => {
            if (t.typeId) {
                const tt = ConfigManager.getTagTypeById(t.typeId);
                if (tt && tt.cardTypeReferenceName) {
                    refCard = CardManager.getCardByName(tt.cardTypeReferenceName, t.value);
                    return true;
                }
            }
            return false;
        });
        return refCard;
    }

    private setSelectedItems(baseParameters: any, card: CardRecord) {
        for (const tag of card.allTags) {
            if (tag.ref) {
                let items = baseParameters[tag.category].selected;
                if (!items) { items = [] }
                items.push(tag.ref);
                baseParameters[tag.category].selected = items;
            }
        }
        return baseParameters;
    }
}
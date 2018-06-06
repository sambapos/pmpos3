import * as React from 'react';
import { Button, DialogContent, DialogActions, DialogTitle } from '@material-ui/core';
import IEditorProperties from '../editorProperties';
import { CardRecord, CardManager, ConfigManager, RuleManager } from 'pmpos-core';
import { extractSections } from '../CardExtractor';
import SectionComponent from '../SectionComponent';
import { ValueSelection } from '../SectionComponent/ValueSelection';
import { Sections } from '../SectionComponent/Sections';
import { SelectedValues } from '../SectionComponent/SelectedValues';
import { Section } from '../SectionComponent/Section';

type IProps = IEditorProperties<{ title: string }>;

interface IState {
    selectedValues: SelectedValues;
}

export default class EditCard extends React.Component<IProps, IState> {
    private baseCard: CardRecord;
    private baseSections = new Sections()

    constructor(props: IProps) {
        super(props);
        this.baseCard = this.getBaseCard(props.card) || new CardRecord();
        if (this.baseCard) {
            this.baseSections = extractSections(this.baseCard);
            this.baseSections = this.setSelectedItems(this.baseSections, props.card);
        }
        this.state = { selectedValues: new SelectedValues(this.baseSections) }
    }

    public render() {
        return (
            <>
                <DialogTitle>
                    {this.props.current ? this.props.current.title : 'Edit'}
                </DialogTitle>
                <DialogContent>
                    {/* {this.props.card.id}
                    <hr />
                    {this.props.card.allTags.map(v => (<div>{v.name},{v.valueDisplay},{v.cardId}</div>))}
                    <hr />
                    {this.baseCard && this.baseCard.name}
                    <hr /> */}
                    {/* <div style={{ border: '1px solid lightgray', borderRadius: 4, background: 'whitesmoke', paddingLeft: 8 }}>
                        <Tags
                            card={this.props.card}
                            parentCard={this.props.card}
                            handleCardClick={(e) => e} />
                    </div> */}
                    {this.getSections()}
                </DialogContent>
                <DialogActions>
                    {/* <Button onClick={() => this.props.cancel()}>Cancel</Button> */}
                    <Button
                        onClick={(e) => {
                            const newValues = this.getNewValues(this.baseSections, this.state.selectedValues);
                            const deletedValues = this.getDeletedValues(this.baseSections, this.state.selectedValues);
                            RuleManager.setState('newValues', newValues);
                            RuleManager.setState('deletedValues', deletedValues);
                            this.props.success(this.props.actionName, { newValues, deletedValues });
                        }}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </>
        );
    }

    private getNewValues(baseSections: Sections, selectedValues: SelectedValues) {
        return baseSections.getNewValues(selectedValues);
    }

    private getDeletedValues(sections: Sections, selectedValues: SelectedValues) {
        return sections.getDeletedValues(selectedValues);
        // let resultMap = new Map<string, ValueSelection[]>();
        // const originalSelection = new SelectedValues(baseSections);
        // for (const [key, values] of originalSelection.entries) {
        //     const result = new Array<ValueSelection>();
        //     const selectedValues = selectedMap.get(key);
        //     if (selectedValues) {
        //         for (const value of values) {
        //             if (selectedValues.every(o => o.ref !== value.ref)) {
        //                 result.push(value);
        //             }
        //         }
        //     }
        //     if (result.length > 0) { resultMap = resultMap.set(key, result); }
        // }
        // console.log('deleted', resultMap);
        // return resultMap;
    }

    private getSectionComponent(section: Section) {
        return <SectionComponent
            key={'Section_' + section.key}
            name={section.key}
            values={section.values}
            selected={section.selected}
            min={section.min}
            max={section.max}
            onChange={(name: string, values: ValueSelection[]) =>
                this.setState({ selectedValues: this.state.selectedValues.set(name, values) })}
        />
    }

    private getSections() {
        return this.baseSections.sections.map(section => this.getSectionComponent(section))
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

    private setSelectedItems(baseParameters: Sections, card: CardRecord): Sections {
        for (const tag of card.allTags) {
            if (tag.ref) {
                baseParameters.addSelectedTag(tag);
            }
        }
        return baseParameters;
    }
}
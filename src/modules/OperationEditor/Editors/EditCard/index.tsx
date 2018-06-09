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
import ValueEditor from '../SectionComponent/ValueEditor';

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
            this.baseSections = extractSections(this.baseCard, props.card);
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
                    {this.getSections()}
                </DialogContent>
                <DialogActions>
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
    }

    private getSectionComponent(section: Section) {
        if (section.values.length === 1) {
            return this.getSectionEditor(section);
        }
        return this.getSectionSelectionComponent(section);
    }

    private getSectionSelectionComponent(section: Section) {
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

    private getValueEditor(sectionName: string, value: ValueSelection) {
        return <ValueEditor
            name={sectionName}
            value={value}
            onChange={(name: string, values: ValueSelection[]) =>
                this.setState({ selectedValues: this.state.selectedValues.set(name, values) })} />
    }

    private getSectionEditor(section: Section) {
        return <div>
            {this.getValueEditor(section.key, section.values[0])}
        </div>
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
}
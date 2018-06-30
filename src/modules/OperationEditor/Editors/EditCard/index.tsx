import * as React from 'react';
import { Button, DialogContent, DialogActions, DialogTitle } from '@material-ui/core';
import IEditorProperties from '../editorProperties';
import { CardRecord, CardManager, ConfigManager, RuleManager, CardTypeRecord } from 'pmpos-core';
import { extractSections } from '../CardExtractor';
import SectionComponent from '../SectionComponent';
import { ValueSelection } from '../SectionComponent/ValueSelection';
import { Sections } from '../SectionComponent/Sections';
import { SelectedValues } from '../SectionComponent/SelectedValues';
import { Section } from '../SectionComponent/Section';
import ValueEditor from '../SectionComponent/ValueEditor';
import decorate, { IStyle } from './style';
import { WithStyles } from '@material-ui/core/styles/withStyles';


type IProps =
    IEditorProperties<{ card: CardRecord, title: string, newValues: Map<string, ValueSelection[]>, deletedValues: Map<string, ValueSelection[]> }>
    & WithStyles<keyof IStyle>;

interface IState {
    selectedValues: SelectedValues;
    cardType: CardTypeRecord | undefined;
}

export class EditCard extends React.Component<IProps, IState> {
    private baseCard: CardRecord;
    private baseSections = new Sections()

    constructor(props: IProps) {
        super(props);
        const card = props.current && props.current.card ? props.current.card : props.card;
        this.baseCard = this.getBaseCard(card) || new CardRecord();
        if (this.baseCard) {
            this.baseSections = extractSections(this.baseCard, card);
        }
        this.state = {
            selectedValues: new SelectedValues(this.baseSections),
            cardType: ConfigManager.getCardTypeById(card.typeId)
        }
    }

    public render() {
        const displayTitle = this.props.current && this.props.current.title;
        return (
            <>
                {displayTitle && <DialogTitle classes={{ root: this.props.classes.contentTitle }}>
                    {this.props.current ? this.props.current.title : 'Edit ' + (this.state.cardType ? this.state.cardType.reference : '')}
                </DialogTitle>}
                <DialogContent classes={{ root: this.props.classes.contentRoot }}>
                    {this.getSections()}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={(e) => {
                            const newValues = this.getNewValues(this.baseSections, this.state.selectedValues);
                            const deletedValues = this.getDeletedValues(this.baseSections, this.state.selectedValues);
                            RuleManager.setState('newValues', newValues);
                            RuleManager.setState('deletedValues', deletedValues);
                            const current: any = this.props.current || {};
                            current.newValues = newValues;
                            current.deletedValues = deletedValues;
                            this.props.success(this.props.actionName, current);
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
        if (section.values.length === 1 && !(section.values[0].isModifier)) {
            return this.getSectionEditor(section);
        }
        return this.getSectionSelectionComponent(section);
    }

    private getSectionSelectionComponent(section: Section) {
        return <div className={this.props.classes.section}><SectionComponent
            key={'Section_' + section.key}
            name={section.key}
            values={section.values}
            selected={section.selected}
            min={section.min}
            max={section.max}
            onChange={(name: string, values: ValueSelection[]) =>
                this.setState({ selectedValues: this.state.selectedValues.set(name, values) })}
        /></div>
    }

    private getValueEditor(sectionName: string, value: ValueSelection, mask: any) {
        return <ValueEditor
            name={sectionName}
            value={value}
            mask={mask}
            onChange={(name: string, values: ValueSelection[]) =>
                this.setState({ selectedValues: this.state.selectedValues.set(name, values) })} />
    }

    private getSectionEditor(section: Section) {
        return <div className={this.props.classes.section}>
            {this.getValueEditor(section.key, section.values[0], section.mask)}
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

export default decorate(EditCard)
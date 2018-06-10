import { CardRecord, CardTagRecord, ConfigManager, CardManager } from "pmpos-core";
import { ValueSelection } from "./SectionComponent/ValueSelection";
import { Section } from "./SectionComponent/Section";
import { Sections } from "./SectionComponent/Sections";

export function extractSections(templateCard: CardRecord, valueCard: CardRecord): Sections {
    let result = new Sections();
    for (const subcard of templateCard.allCardsSorted) {
        const section = extractSection(subcard);
        if (section && section.values.length > 0) {
            result.add(section);
        }
    }
    const sectionKeys = result.sections.map(x => x.key);
    for (const tag of valueCard.allTags.filter(t => sectionKeys.every(sk => t.category !== sk))) {
        const value = new ValueSelection(tag);
        const section = new Section(tag.name, [tag.id], [value], 0, 0);
        result.add(section);
    }
    result = setSelectedItems(result, valueCard);
    return result;
}

export function extract(card: CardRecord) {
    const result = {};
    for (const subcard of card.allCardsSorted) {
        const section = extractSection(subcard);
        if (section) { result[section.key] = section; }
    }
    return result;
}

function extractSection(card: CardRecord): Section | undefined {
    const refTag = getReferenceTag(card);
    if (refTag) {
        return extractSectionFromTag(card, refTag);
    }
    const values = card.allTags.filter(t => t.name !== 'Name').map(t => new ValueSelection(t));
    return new Section(card.name, [], values, 1, 1);
};

function getReferenceTag(card: CardRecord) {
    return card.allTags.find(x => Boolean(x.typeId));
}

function extractSectionFromTag(baseCard: CardRecord, tag: CardTagRecord): Section | undefined {
    const tt = ConfigManager.getTagTypeById(tag.typeId);
    if (tt && tt.cardTypeReferenceName) {
        const referenceCard = CardManager.getCardById(tag.cardId);
        if (referenceCard) { return getSectionFromCard(tag.value, baseCard, referenceCard); }
    }
    return undefined;
}

function getSectionFromCard(key: string, baseCard: CardRecord, valuesCard: CardRecord): Section {
    const selected = [];
    const values = valuesCard.allCardsSorted
        .map(t => new ValueSelection(t))
        .filter(t => t.value);
    const max = Number(baseCard.getTag('Max', 0));
    const min = Number(baseCard.getTag('Min', 0));
    return new Section(key, selected, values, max, min);
}

function setSelectedItems(sections: Sections, card: CardRecord): Sections {
    for (const tag of card.allTags) {
        if (tag.ref) {
            sections.addSelectedTag(tag);
        }
    }
    return sections;
}
import { CardRecord, CardTagRecord, ConfigManager, CardManager, TagTypeRecord } from "pmpos-core";
import { ValueSelection } from "./SectionComponent/ValueSelection";
import { Section } from "./SectionComponent/Section";
import { Sections } from "./SectionComponent/Sections";
import * as shortid from 'shortid';

export function extractSections(templateCard: CardRecord, valueCard: CardRecord): Sections {
    let result = new Sections();
    for (const subcard of templateCard.allCardsSorted) {
        const section = extractSection(subcard);
        if (section && section.values.length > 0) {
            result.add(section);
        }
    }
    const sectionKeys = result.sections.map(x => x.key);

    let tags = getCardTagsAndDefaults(valueCard).reverse().filter(t => sectionKeys.every(sk => t.category !== sk));

    const modifierTags = tags.filter(x => x.name.startsWith('_'));
    if (modifierTags.length > 0) {
        const modifierValues = modifierTags.map(x => new ValueSelection(x));
        const modifierSection = new Section('Modifiers', [], modifierValues, 0, 0, undefined);
        for (const anonTag of modifierTags) {
            modifierSection.addSelectedTag(anonTag);
        }
        result.insert(modifierSection);
    }

    tags = tags.filter(x => !x.name.startsWith('_'));

    for (const tag of tags) {
        const value = new ValueSelection(tag);
        const section = new Section(tag.name, [tag.id], [value], 0, 0, ConfigManager.getTagTypeById(tag.typeId));
        result.insert(section);
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
    return new Section(card.name, [], values, 1, 1, undefined);
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
    return new Section(key, selected, values, max, min, undefined);
}

function setSelectedItems(sections: Sections, card: CardRecord): Sections {
    for (const tag of card.allTags) {
        if (tag.ref) {
            sections.addSelectedTag(tag);
        }
    }
    return sections;
}

function getCardTagsAndDefaults(card: CardRecord) {
    const result = new Array<CardTagRecord>();
    const currentTags = [...card.allTags];
    const ct = ConfigManager.getCardTypeById(card.typeId);
    if (ct) {
        const tagTypes = ct.tagTypes.reduce((r, id) => {
            const tagType = ConfigManager.getTagTypeById(id);
            if (tagType) { r.push(tagType) };
            return r;
        }, new Array<TagTypeRecord>());
        for (const tt of tagTypes) {
            const currentTagIndex = currentTags.findIndex(c => c.typeId === tt.id);
            if (currentTagIndex > -1) {
                result.push(currentTags[currentTagIndex]);
                currentTags.splice(currentTagIndex, 1);
            } else {
                const newTag = tt.createDefaultTag();
                newTag.id = shortid.generate();
                result.push(new CardTagRecord(newTag));
            }
        }
    }
    result.push(...currentTags);
    return result;
}
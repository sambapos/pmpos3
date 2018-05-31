import { CardRecord, CardTagRecord, ConfigManager, CardManager } from "pmpos-core";
import { ValueSelection } from "./ValueSelection";
import { ISection } from "./ISection";


export default function extract(card: CardRecord): {} {
    const result = {};
    for (const subcard of card.allCardsSorted) {
        const sectionKey = extractSection(subcard);
        if (sectionKey.section && sectionKey.section.values.length > 0) {
            result[sectionKey.key] = sectionKey.section;
        }
    }
    return result;
}

function extractSection(card: CardRecord): { key: string, section: ISection | undefined } {
    const refTag = getReferenceTag(card);
    if (refTag) {
        return { key: refTag.value, section: extractSectionFromTag(card, refTag) };
    }
    return {
        key: card.name,
        section: {
            selected: '',
            max: 0,
            min: 0,
            values: card.allTags.filter(t => t.name !== 'Name').map(t => new ValueSelection(t))
        }
    }
};

function getReferenceTag(card: CardRecord) {
    return card.allTags.find(x => Boolean(x.typeId));
}

function extractSectionFromTag(baseCard: CardRecord, tag: CardTagRecord): ISection | undefined {
    const tt = ConfigManager.getTagTypeById(tag.typeId);
    if (tt && tt.cardTypeReferenceName) {
        const referenceCard = CardManager.getCardById(tag.cardId);
        if (referenceCard) { return getSectionFromCard(baseCard, referenceCard); }
    }
    return undefined;
}

function getSectionFromCard(baseCard: CardRecord, valuesCard: CardRecord): ISection {
    const selected = '';
    const values = valuesCard.allCardsSorted
        .map(t => new ValueSelection(t))
        .filter(t => t.value);
    const max = Number(baseCard.getTag('Max', 0));
    const min = Number(baseCard.getTag('Min', 0));
    return { selected, values, max, min };
}
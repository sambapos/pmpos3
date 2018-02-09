import { CardRecord } from '../Card';
import CardList from '../../modules/CardList';
import { Map as IMap } from 'immutable';

it('calculates wallet balance', () => {

    let cards = IMap<string, CardRecord>();
    cards = cards.set('1', new CardRecord({ id: '1' })
        .tag({ name: 'P', value: 'Cash', quantity: 5, unit: 'TL', amount: 1, target: 'Wallet' }));
    cards = cards.set('2', new CardRecord({ id: '2' })
        .tag({ name: 'P', value: 'Cash', quantity: 15, unit: 'TL', amount: 1, target: 'Wallet' }));
    cards = cards.set('3', new CardRecord({ id: '3' })
        .tag({ name: 'P', value: 'Cash', quantity: 10, unit: 'TL', amount: 1, target: 'Wallet' }));

    let tags = CardList.getTagsFrom(['wallet'], cards);
    let debit = tags.reduce((r, t) => r += t.getDebitFor('Wallet'), 0);
    let credit = tags.reduce((r, t) => r += t.getCreditFor('Wallet'), 0);

    expect(debit).toEqual(30);
    expect(credit).toEqual(0);

    cards = cards.set('4', new CardRecord({ id: '4' })
        .tag({ name: 'P', value: 'Cash', quantity: 10, unit: 'TL', amount: 1, source: 'Wallet', target: 'Supplier' }));

    tags = CardList.getTagsFrom(['wallet'], cards);
    debit = tags.reduce((r, t) => r += t.getDebitFor('Wallet'), 0);
    credit = tags.reduce((r, t) => r += t.getCreditFor('Wallet'), 0);

    expect(debit).toEqual(30);
    expect(credit).toEqual(10);

    tags = CardList.getTagsFrom(['supplier'], cards);
    debit = tags.reduce((r, t) => r += t.getDebitFor('supplier'), 0);
    credit = tags.reduce((r, t) => r += t.getCreditFor('supplier'), 0);

    expect(debit).toEqual(10);
    expect(credit).toEqual(0);

});

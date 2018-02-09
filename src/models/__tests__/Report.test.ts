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

it('calculates inventory and profit', () => {
    let cards = IMap<string, CardRecord>();
    cards = cards.set('1', new CardRecord({ id: '1' })
        .tag({ name: 'P', value: 'Kola', quantity: 10, amount: 5, target: 'Bar' }));
    cards = cards.set('2', new CardRecord({ id: '2' })
        .tag({ name: 'P', value: 'Kola', quantity: 40, amount: 5, target: 'Bar' }));
    cards = cards.set('3', new CardRecord({ id: '3' })
        .tag({ name: 'P', value: 'Kola', quantity: 2, amount: 6, source: 'Bar' }));
    cards = cards.set('4', new CardRecord({ id: '4' })
        .tag({ name: 'P', value: 'Fanta', quantity: 10, amount: 5, target: 'Bar' }));

    let tags = CardList.getTagsFrom(['bar'], cards);
    let inTotal = tags.reduce((r, t) => r += t.tag.getInQuantityFor('Kola'), 0);
    let outTotal = tags.reduce((r, t) => r += t.tag.getOutQuantityFor('Kola'), 0);
    expect(inTotal - outTotal).toEqual(48);

    let creditTotal = tags.reduce((r, t) => r += t.getCreditFor('Kola'), 0);
    expect(creditTotal).toEqual(12);
    let debitTotal = tags.reduce((r, t) => r += t.getDebitFor('Kola'), 0);
    expect(debitTotal).toEqual(250);

    let avgC = creditTotal / outTotal;
    expect(avgC).toEqual(6);
    let avgD = debitTotal / inTotal;
    expect(avgD).toEqual(5);
    let profit = avgC - avgD;
    expect(profit).toEqual(1);
    let rate = (profit * 100) / avgD;
    expect(rate).toEqual(20);
});

import { CardRecord } from 'pmpos-models';
import { Map as IMap } from 'immutable';
import { CardList } from 'pmpos-modules';

it('calculates wallet balance', () => {

    let cards = IMap<string, CardRecord>();
    cards = cards.set('1', new CardRecord({ id: '1' })
        .tag({ name: 'P', value: 'Cash', quantity: 5, unit: 'TL', price: 1, target: 'Wallet' }));
    cards = cards.set('2', new CardRecord({ id: '2' })
        .tag({ name: 'P', value: 'Cash', quantity: 15, unit: 'TL', price: 1, target: 'Wallet' }));
    cards = cards.set('3', new CardRecord({ id: '3' })
        .tag({ name: 'P', value: 'Cash', quantity: 10, unit: 'TL', price: 1, target: 'Wallet' }));

    let tags = CardList.getTagsFrom(['wallet'], cards);
    let debit = tags.reduce((r, t) => r += t.getDebitFor('Wallet'), 0);
    let credit = tags.reduce((r, t) => r += t.getCreditFor('Wallet'), 0);

    expect(debit).toEqual(30);
    expect(credit).toEqual(0);

    cards = cards.set('4', new CardRecord({ id: '4' })
        .tag({ name: 'P', value: 'Cash', quantity: 10, unit: 'TL', price: 1, source: 'Wallet', target: 'Supplier' }));

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
        .tag({ name: 'P', value: 'Kola', quantity: 10, price: 5, target: 'Bar' }));
    cards = cards.set('2', new CardRecord({ id: '2' })
        .tag({ name: 'P', value: 'Kola', quantity: 40, price: 5, target: 'Bar' }));
    cards = cards.set('3', new CardRecord({ id: '3' })
        .tag({ name: 'P', value: 'Kola', quantity: 2, price: 6, source: 'Bar' }));
    cards = cards.set('4', new CardRecord({ id: '4' })
        .tag({ name: 'P', value: 'Fanta', quantity: 10, price: 5, target: 'Bar' }));

    const tags = CardList.getTagsFrom(['bar'], cards);
    const inTotal = tags.reduce((r, t) => r += t.tag.getInQuantityFor('Kola'), 0);
    const outTotal = tags.reduce((r, t) => r += t.tag.getOutQuantityFor('Kola'), 0);
    expect(inTotal - outTotal).toEqual(48);

    const creditTotal = tags.reduce((r, t) => r += t.getCreditFor('Kola'), 0);
    expect(creditTotal).toEqual(12);
    const debitTotal = tags.reduce((r, t) => r += t.getDebitFor('Kola'), 0);
    expect(debitTotal).toEqual(250);

    const avgC = creditTotal / outTotal;
    expect(avgC).toEqual(6);
    const avgD = debitTotal / inTotal;
    expect(avgD).toEqual(5);
    const profit = avgC - avgD;
    expect(profit).toEqual(1);
    const rate = (profit * 100) / avgD;
    expect(rate).toEqual(20);
});

it('calculates customer balance', () => {
    let cards = IMap<string, CardRecord>();

    let invoice1 = new CardRecord({ id: '1' })
        .tag('Name', 'A0001')
        .tag('Customer', 'Emre Eren')
        .sub('1a', card => card.tag({ name: 'P', value: 'Kola', quantity: 2, price: 6, source: 'Bar' }))
        .sub('1b', card => card.tag({ name: 'P', value: 'Çay', quantity: 1, price: 4, source: 'Bar' }));

    cards = cards.set(invoice1.id, invoice1);

    expect(invoice1.cards.count()).toEqual(2);
    expect(invoice1.balance).toEqual(16);

    let invoice2 = new CardRecord({ id: '2' })
        .tag('Name', 'A0002')
        .tag('Customer', 'Emre Eren')
        .sub('2a', card => card.tag({ name: 'P', value: 'Fanta', quantity: 2, price: 6, source: 'Bar' }))
        .sub('2b', card => card.tag({ name: 'P', value: 'Çay', quantity: 1, price: 4, source: 'Bar' }));

    cards = cards.set(invoice2.id, invoice2);

    const invoice3 = new CardRecord({ id: '3' })
        .tag('Name', 'A0003')
        .tag('Customer', 'Hasan Bey')
        .sub('3a', card => card.tag({ name: 'P', value: 'Fanta', quantity: 2, price: 6, source: 'Bar' }))
        .sub('3b', card => card.tag({ name: 'P', value: 'Çay', quantity: 1, price: 4, source: 'Bar' }));

    cards = cards.set(invoice3.id, invoice3);

    expect(invoice2.balance).toEqual(16);
    expect(invoice2.getTag('Customer', '')).toEqual('Emre Eren');

    expect(cards.count()).toEqual(3);
    let tags = CardList.getTagsFrom(['Emre Eren'], cards);
    expect(tags.count()).toEqual(2);

    let debit = tags.reduce((r, t) => r += t.getDebitFor('Emre Eren'), 0);
    let credit = tags.reduce((r, t) => r += t.getCreditFor('Emre Eren'), 0);
    expect(debit).toEqual(32);
    expect(credit).toEqual(0);

    invoice1 = invoice1.sub('1c', card => card.tag(
        { name: 'O', value: 'Nakit', quantity: 16, unit: 'TL', price: 1, target: 'Kasa' }));
    expect(invoice1.balance).toEqual(0);
    cards = cards.set(invoice1.id, invoice1);

    tags = CardList.getTagsFrom(['Emre Eren'], cards);
    debit = tags.reduce((r, t) => r += t.getDebitFor('Emre Eren'), 0);
    credit = tags.reduce((r, t) => r += t.getCreditFor('Emre Eren'), 0);
    expect(debit).toEqual(32);
    expect(credit).toEqual(16);

    invoice2 = invoice2.sub('2c', card => card.tag(
        { name: 'O', value: 'Account', price: 16, target: 'Emre Eren' }
    ));
    expect(invoice2.balance).toEqual(0);
    cards = cards.set(invoice2.id, invoice2);

    tags = CardList.getTagsFrom(['Emre Eren'], cards);
    debit = tags.reduce((r, t) => r += t.getDebitFor('Emre Eren'), 0);
    credit = tags.reduce((r, t) => r += t.getCreditFor('Emre Eren'), 0);
    expect(debit).toEqual(48);
    expect(credit).toEqual(32);

    const receipt1 = new CardRecord({ id: '4' })
        .tag('Name', 'R0001')
        .sub('R1b', card => card.tag(
            { name: 'P', value: 'Nakit', quantity: 16, price: 1, unit: 'TL', source: 'Emre Eren', target: 'Kasa' }));
    cards = cards.set(receipt1.id, receipt1);
    expect(receipt1.balance).toEqual(0);

    tags = CardList.getTagsFrom(['Emre Eren'], cards);
    expect(tags.count()).toEqual(4);

    debit = tags.reduce((r, t) => r += t.getDebitFor('Emre Eren'), 0);
    credit = tags.reduce((r, t) => r += t.getCreditFor('Emre Eren'), 0);
    expect(debit).toEqual(48);
    expect(credit).toEqual(48);

    tags = CardList.getTagsFrom(['Kasa'], cards);
    debit = tags.reduce((r, t) => r += t.getDebitFor('Kasa'), 0);
    expect(debit).toEqual(32);

});
import { CardRecord } from '../Card';

it('creates card', () => {
    let c = new CardRecord({ id: '0' });
    expect(c.id).toEqual('0');
});

it('tags card name', () => {
    let c = new CardRecord();
    c = c.tag('Name', 'Test');
    expect(c.name).toEqual('Test');
});

it('creates sub card', () => {
    let c = new CardRecord();
    c = c.sub('xyz');
    expect(c.cards.count()).toEqual(1);
    let subCard = c.cards.get('xyz') as CardRecord;
    expect(subCard.id).toEqual('xyz');
});

it('tags sub card', () => {
    let c = new CardRecord();
    c = c.sub('xyz', sub => sub.tag('Name', 'Test'));
    expect((<CardRecord>c.cards.get('xyz')).name).toEqual('Test');
});

it('tags sub card partially', () => {
    let c = new CardRecord();
    c = c.sub('xyz', sub => sub.tag({ name: 'Name', value: 'Test' }));
    expect((<CardRecord>c.cards.get('xyz')).name).toEqual('Test');
});

it('tags source value', () => {
    let c = new CardRecord().tag({
        name: 'Product',
        value: 'Blue Stamp',
        quantity: 1,
        amount: 5,
        source: 'Book'
    });
    expect(c.balance).toEqual(5);
});

it('tranfers tag value', () => {
    let c = new CardRecord().tag({
        name: 'Product',
        value: 'Blue Stamp',
        quantity: 1,
        amount: 5,
        source: 'Book',
        target: 'Other Book'
    });
    expect(c.balance).toEqual(0);
});

it('sums multiple card balances', () => {
    let c = new CardRecord();
    c = c.sub('1', card => card.tag({
        name: 'Product',
        value: 'Blue Stamp',
        quantity: 1,
        amount: 5,
        source: 'Book'
    }));
    c = c.sub('2', card => card.tag({
        name: 'Product',
        value: 'Green Stamp',
        quantity: 1,
        amount: 10,
        source: 'Book'
    }));
    expect(c.balance).toEqual(15);
});
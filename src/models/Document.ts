import Exchange from './Exchange';

export default interface Document {
    id: string;
    date: Date;
    exchanges: Exchange[];
}
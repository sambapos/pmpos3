import {
    Map,
    Iterable,
} from 'immutable';

/**
 * Interface that inherit from Immutable.Map that overrides all methods that
 * would return a new version of Immutable.Map itself to return <T> instead.
 * Although it is possible to do, this interface is not currently
 * supports a different Immutable.Map rather than Map<string, any>. Thus
 * all TypedRecord<T> operators will have <any> as the object type and also
 * notSetValue argument type when performing functional programming changes.
 * Key will always be a string.
 *
 * Map<string, any> is a very flexible combination that supports basically
 * everything. However another interface can be created between TypedRecord
 * and Immutable.Map to support the generic Map arguments <K> and <V> or this
 * interface can require more generic arguments in order to support K, V.
 *
 * The implementation of this TypedRecord interface requires two interfaces. One
 * representing the target data structure, and another the Record itself, that
 * makes the bridge between them.
 *
 * For instance:
 *   interface IPerson {
 *     name: string;
 *   }
 *
 *   interface IPersonRecord extends from TypedRecord<IPersonRecord>, IPerson {}
 *
 * Examples in test file: 'test/typed.record.test.ts'
 */
export interface TypedRecord<T extends TypedRecord<T>>
    extends Map<string, any> {

    set: <K extends keyof T>(prop: K, val: any) => T;
    delete: <K extends keyof T>(key: K) => T;
    remove: <K extends keyof T>(key: K) => T;
    clear: () => T;
    update: {
        (updater: (value: T) => any): T;
        (key: string, updater: (value: any) => any): T;
        (key: string, notSetValue: any, updater: (value: any) => any): T;
    };
    merge: (obj: any) => T;
    mergeWith: (
        merger: (previous?: any, next?: any, key?: string) => any,
        obj: any
    ) => T;
    mergeDeep: (obj: any) => T;
    mergeDeepWith: (
        merger: (previous?: any, next?: any, key?: string) => any,
        obj: any
    ) => T;
    setIn: (keyPath: any[] | Iterable<any, any>, value: any) => T;
    deleteIn: (keyPath: Array<any> | Iterable<any, any>) => T;
    removeIn: (keyPath: Array<any> | Iterable<any, any>) => T;
    updateIn: {
        (keyPath: any[] | Iterable<any, any>, updater: (value: any) => any): T;
        (
            keyPath: any[] | Iterable<any, any>,
            notSetValue: any,
            updater: (value: any) => any
        ): T
    };
    mergeIn: (keyPath: any[] | Iterable<any, any>, obj: any) => T;
    mergeDeepIn: (keyPath: any[] | Iterable<any, any>, obj: any) => T;
    withMutations: (mutator: (mutable: T) => any) => T;
    asMutable: () => T;
    asImmutable: () => T;
}
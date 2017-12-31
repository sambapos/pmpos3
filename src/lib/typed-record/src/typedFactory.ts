import { TypedRecord } from './typedRecord';
import { Record } from 'immutable';

/**
 * Creates a factory function you can use to make TypedRecords.
 *
 * Every TypedRecord instance produced from the factory function will have a
 * read-only property for each of the fields in the argument object.
 *
 * Additionally, TypedRecords created by the factory function will have the
 * TypeScript shape defined by E.
 *
 * Finally, these TypedRecords expose the same interface as
 * Immutable.Map<string, any>, but type adjusted to that mutating methods return
 * a TypedRecord of the original type.
 *
 * The caller must provide two interfaces described below:
 *
 * <E>: The TypeScript shape of the plain JavaScript object to be made
 * immutable.
 * 
 * <T>: The desired TypedRecord type that each immutable record produced by the
 * factory will have. In nearly all cases this will be an interface
 * that extends TypedRecord<T> & E.
 *
 * @param obj is a plain JS that meets the requirements described in the
 * provided <E> interface. This object is used to set the default values of the
 * Immutable.Record
 * @param name of the record
 * @returns {function(E=): T} a function Factory to produce instances of a
 * TypedRecord<T>
 * @see recordify
 */
export function makeTypedFactory<E, T extends TypedRecord<T> & E>
    (obj: E, name?: string): (val?: E) => T {

    const ImmutableRecord = Record(obj, name);
    return function TypedFactory(val: E): T {
        return new ImmutableRecord(val) as T;
    };
}

/**
 * Utility function to generate an Immutable.Record for the provided type.
 * The caller must provide two interfaces described below:
 *
 * <E>: The TypeScript shape of the plain JavaScript object to be made
 * immutable.
 *
 * <T>: The desired TypedRecord type that each immutable record produced by the
 * factory will have. In nearly all cases this will be an interface
 * that extends TypedRecord<T> & E.
 *
 * This Method also does not return the {TypedFactory}, which means that it will
 * be impossible to generate new instances of the same TypedFactory. This is
 * ideal for scenarios where you are performing an operation that produces
 * one instance of <T>, with either a default or current val see the following
 * params:
 *
 * @param defaultVal is the default value for the created record type.
 * @param val is an optional attribute representing the current value for this
 * Record.
 * @param name of the record
 * @returns {T} that is the new created TypedRecord
 */
export function recordify<E, T extends TypedRecord<T> & E>(
    defaultVal: E,
    val: E,
    name?: string): T {

    const TypedRecordFactory = makeTypedFactory<E, T>(defaultVal, name);
    return val ? TypedRecordFactory(val) : TypedRecordFactory();
}
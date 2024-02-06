/* tslint:disable */
/* eslint-disable */
/**
 * Immich
 * Immich API
 *
 * The version of the OpenAPI document: 1.94.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface UpdateLibraryDto
 */
export interface UpdateLibraryDto {
    /**
     * 
     * @type {Array<string>}
     * @memberof UpdateLibraryDto
     */
    exclusionPatterns?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UpdateLibraryDto
     */
    importPaths?: Array<string>;
    /**
     * 
     * @type {boolean}
     * @memberof UpdateLibraryDto
     */
    isVisible?: boolean;
    /**
     * 
     * @type {string}
     * @memberof UpdateLibraryDto
     */
    name?: string;
}

/**
 * Check if a given object implements the UpdateLibraryDto interface.
 */
export function instanceOfUpdateLibraryDto(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function UpdateLibraryDtoFromJSON(json: any): UpdateLibraryDto {
    return UpdateLibraryDtoFromJSONTyped(json, false);
}

export function UpdateLibraryDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): UpdateLibraryDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'exclusionPatterns': !exists(json, 'exclusionPatterns') ? undefined : json['exclusionPatterns'],
        'importPaths': !exists(json, 'importPaths') ? undefined : json['importPaths'],
        'isVisible': !exists(json, 'isVisible') ? undefined : json['isVisible'],
        'name': !exists(json, 'name') ? undefined : json['name'],
    };
}

export function UpdateLibraryDtoToJSON(value?: UpdateLibraryDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'exclusionPatterns': value.exclusionPatterns,
        'importPaths': value.importPaths,
        'isVisible': value.isVisible,
        'name': value.name,
    };
}

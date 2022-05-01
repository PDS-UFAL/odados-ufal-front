import { Trimmed, TrimmedEntity } from '../trimmed/trimmed.plugin';
export declare const TRIMMED_GROUPING = "grouping";
/**
 * Prepare trimming updated indexes for grouping
 * @param initiallyTrimed
 * @param firstLevelMap
 * @param secondLevelMap
 */
export declare function processDoubleConversionTrimmed(initiallyTrimed: Trimmed, firstLevelMap: Record<number, number>, secondLevelMap?: Record<number, number>): Trimmed;
export declare function filterOutEmptyGroups(allTrimmedGroups: Trimmed, childrenByGroup?: Record<number, number[]>): TrimmedEntity;

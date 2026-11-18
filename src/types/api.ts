import type { components } from '@/lib/api-types'

type Schemas = components['schemas']

export type LocalizedText = Schemas['LocalizedText']
export type LessonSummary = Schemas['LessonSummary']
export type LessonDetail = Schemas['LessonDetail']
export type LessonModel = Schemas['Model3DOut']
export type ModelStructure = Schemas['Structure']
export type MoleculeSummary = Schemas['MoleculeSummary']
export type MoleculeDetail = Schemas['MoleculeDetail']
export type MoleculeStructure = Schemas['MoleculeStructure']
export type ReactionDetail = Schemas['ReactionDetail']
export type Vector3Tuple = Schemas['Vector3']
export type BondTuple = Schemas['Bond']

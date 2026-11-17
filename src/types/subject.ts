// Subject codes are shared with the backend and asset paths (e.g. "sinh/tim.glb")
export type SubjectKey = 'ly' | 'hoa' | 'sinh'

export type LabView = SubjectKey | 'all'

export type Subject = {
  key: SubjectKey
  name: string
  modelName: string
  chalkColor: string
  textChalkClass: string
  textInkClass: string
  borderInkClass: string
  tagline: string
  description: string
  simulations: string[]
}

export type GradePlan = {
  grade: number
  topics: Record<SubjectKey, string[]>
}

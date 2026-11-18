// Subject codes are shared with the backend (lessons.subject) and asset folders.
export type SubjectKey = 'physics' | 'chemistry' | 'biology'

export type LabView = SubjectKey | 'all'

export type Subject = {
  key: SubjectKey
  chalkColor: string
  textChalkClass: string
  textInkClass: string
  borderInkClass: string
}

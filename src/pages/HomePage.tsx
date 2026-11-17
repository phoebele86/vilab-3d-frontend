import { useState } from 'react'

import { HeroSection } from '@/components/home/HeroSection'
import { LessonFlowSection } from '@/components/home/LessonFlowSection'
import { RoadmapSection } from '@/components/home/RoadmapSection'
import { SubjectsSection } from '@/components/home/SubjectsSection'
import { AppFooter } from '@/components/layout/AppFooter'
import type { LabView, SubjectKey } from '@/types/subject'

export const HomePage = () => {
  const [activeView, setActiveView] = useState<LabView>('all')

  const previewSubject = (key: SubjectKey) => {
    setActiveView(key)
    document.getElementById('lab')?.scrollIntoView()
  }

  return (
    <>
      <HeroSection activeView={activeView} onSelect={setActiveView} />

      <main className="bg-notebook relative">
        {/* Red margin line of a Vietnamese school notebook */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-10 hidden w-0.5 bg-margin/70 sm:block lg:left-16"
        />
        <div className="mx-auto max-w-6xl px-4 sm:pr-8 sm:pl-20 lg:pl-24">
          <SubjectsSection onPreview={previewSubject} />
          <RoadmapSection />
          <LessonFlowSection />
        </div>
      </main>

      <AppFooter />
    </>
  )
}

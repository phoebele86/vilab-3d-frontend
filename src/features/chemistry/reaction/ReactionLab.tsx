import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { SceneNotice } from '@/components/common/SceneNotice'
import { LabShell } from '@/components/layout/LabShell'
import { useChemistryErrorMessage, useReaction } from '@/features/chemistry/queries'
import { useReactionPlayback } from '@/features/chemistry/reaction/playbackStore'
import { ReactionPanel } from '@/features/chemistry/reaction/ReactionPanel'
import { ReactionScene } from '@/features/chemistry/reaction/ReactionScene'
import { useLocalizedText } from '@/hooks/useLocalizedText'
import type { LabProps } from '@/types/lab'

const readEquations = (config: Record<string, unknown>) =>
  Array.isArray(config.equations) ? config.equations.filter((item): item is string => typeof item === 'string') : []

export const ReactionLab = ({ model, lessonLabel, toolbar }: LabProps) => {
  const { t } = useTranslation()
  const localize = useLocalizedText()
  const getErrorMessage = useChemistryErrorMessage()
  const presets = readEquations(model.config)
  const [equation, setEquation] = useState(presets.at(0) ?? 'H2 + O2 -> H2O')
  const { data: reaction, error, isFetching } = useReaction(equation)
  const restart = useReactionPlayback((state) => state.restart)

  // Every newly loaded reaction plays from the start.
  useEffect(() => {
    if (reaction) restart()
  }, [reaction, restart])

  const scene = reaction ? (
    <ReactionScene reaction={reaction} />
  ) : (
    <SceneNotice text={isFetching ? t('reaction.loading') : t('reaction.empty')} />
  )

  return (
    <LabShell
      title={localize(model.name)}
      lessonLabel={lessonLabel}
      toolbar={toolbar}
      scene={scene}
      panel={
        <ReactionPanel
          presets={presets}
          equation={equation}
          onSubmit={setEquation}
          reaction={reaction}
          errorMessage={error ? getErrorMessage(error) : null}
          isLoading={isFetching}
          shouldExplainConservation={model.config.showAtomCounter === true}
        />
      }
    />
  )
}

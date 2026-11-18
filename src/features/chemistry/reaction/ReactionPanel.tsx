import { Alert, Button, Input, Segmented, Slider, Space } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { EquationText } from '@/features/chemistry/Formula'
import { getElementStyle } from '@/features/chemistry/elements'
import { useReactionPlayback } from '@/features/chemistry/reaction/playbackStore'
import { getStageIndex, REACTION_STAGES } from '@/features/chemistry/reaction/reactionTimeline'
import type { ReactionDetail } from '@/types/api'

const SPEEDS = [0.5, 1, 2]

const countElements = (atoms: ReactionDetail['left']['atoms']) =>
  atoms.reduce<Record<string, number>>((counts, { el }) => ({ ...counts, [el]: (counts[el] ?? 0) + 1 }), {})

const PlaybackControls = () => {
  const { t, i18n } = useTranslation()
  const { progress, isPlaying, speed, play, pause, seek, setSpeed } = useReactionPlayback()
  const playLabel = progress >= 1 ? t('reaction.replay') : t('reaction.play')
  const speedOptions = SPEEDS.map((value) => ({ label: `${new Intl.NumberFormat(i18n.language).format(value)}×`, value }))
  const stageIndex = getStageIndex(progress)

  return (
    <section>
      <div className="flex items-center gap-3">
        <Button type="primary" onClick={isPlaying ? pause : play} className="min-w-24">
          {isPlaying ? t('reaction.pause') : playLabel}
        </Button>
        <Segmented size="small" value={speed} onChange={setSpeed} options={speedOptions} />
      </div>
      <Slider
        className="mt-4"
        min={0}
        max={100}
        value={Math.round(progress * 100)}
        onChange={(value) => seek(value / 100)}
        tooltip={{ open: false }}
      />
      <ol className="mt-3 mb-0 space-y-1.5 pl-5">
        {REACTION_STAGES.map(({ key }, index) => (
          <li key={key} className={index === stageIndex ? 'font-bold text-purple-ink' : 'text-ink-soft'}>
            {t(`reaction.stages.${key}`)}
          </li>
        ))}
      </ol>
    </section>
  )
}

type ReactionPanelProps = {
  presets: string[]
  equation: string
  onSubmit: (equation: string) => void
  reaction: ReactionDetail | undefined
  errorMessage: string | null
  isLoading: boolean
  shouldExplainConservation: boolean
}

export const ReactionPanel = ({
  presets,
  equation,
  onSubmit,
  reaction,
  errorMessage,
  isLoading,
  shouldExplainConservation,
}: ReactionPanelProps) => {
  const { t } = useTranslation()
  const [draft, setDraft] = useState(equation)
  const submit = (value: string) => {
    setDraft(value)
    onSubmit(value.trim())
  }
  const leftCounts = reaction ? countElements(reaction.left.atoms) : {}
  const rightCounts = reaction ? countElements(reaction.right.atoms) : {}

  return (
    <div className="space-y-7">
      <section>
        <h2 className="m-0 text-lg font-bold text-purple-ink">{t('reaction.choose')}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {presets.map((preset) => (
            <Button key={preset} size="small" type={preset === equation ? 'primary' : 'default'} onClick={() => submit(preset)}>
              <EquationText value={preset} />
            </Button>
          ))}
        </div>
        <p className="mt-4 mb-2 text-sm font-semibold text-ink-soft">{t('reaction.custom')}</p>
        <Space.Compact className="w-full">
          <Input
            value={draft}
            onChange={({ target }) => setDraft(target.value)}
            onPressEnter={() => submit(draft)}
            placeholder={t('reaction.placeholder')}
            aria-label={t('reaction.inputLabel')}
          />
          <Button type="primary" loading={isLoading} onClick={() => submit(draft)}>
            {t('reaction.simulate')}
          </Button>
        </Space.Compact>
      </section>

      {errorMessage && <Alert type="warning" showIcon message={errorMessage} />}

      {reaction && (
        <>
          <section aria-live="polite">
            <h2 className="m-0 text-lg font-bold text-purple-ink">{t('reaction.balanced')}</h2>
            <EquationText value={reaction.balanced} className="mt-2 block text-2xl font-semibold text-ink" />
          </section>

          <PlaybackControls />

          <section>
            <h2 className="m-0 text-lg font-bold text-purple-ink">{t('reaction.atomsTitle')}</h2>
            <table className="mt-3 w-full border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-grid-strong text-sm text-ink-soft">
                  <th className="py-2 font-semibold">{t('reaction.element')}</th>
                  <th className="py-2 font-semibold">{t('reaction.before')}</th>
                  <th className="py-2 font-semibold">{t('reaction.after')}</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(leftCounts).map(([symbol, count]) => (
                  <tr key={symbol} className="border-b border-grid-strong">
                    <td className="py-2">
                      <span
                        aria-hidden="true"
                        className="mr-2 inline-block size-3 rounded-full align-middle"
                        style={{ backgroundColor: getElementStyle(symbol).color }}
                      />
                      {symbol}
                    </td>
                    <td className="py-2 font-semibold">{count}</td>
                    <td className="py-2 font-semibold">{rightCounts[symbol] ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 mb-0 text-sm text-ink-soft">
              {shouldExplainConservation ? t('reaction.conservationNote') : t('reaction.bondNote')}
            </p>
          </section>
        </>
      )}
    </div>
  )
}

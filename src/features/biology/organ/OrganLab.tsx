import { Button, Slider, Switch } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { LabShell } from '@/components/layout/LabShell'
import { OrganScene } from '@/features/biology/organ/OrganScene'
import { useLocalizedText } from '@/hooks/useLocalizedText'
import type { LabProps } from '@/types/lab'

export const OrganLab = ({ model, lessonLabel, toolbar }: LabProps) => {
  const { t } = useTranslation()
  const localize = useLocalizedText()
  const [selected, setSelected] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [explode, setExplode] = useState(0)
  const [isIsolated, setIsIsolated] = useState(false)
  const { structures } = model
  const credit = typeof model.config.credit === 'string' ? model.config.credit : null
  const selectedLabel = structures.find(({ node }) => node === selected)?.label

  if (!model.path) return null

  const panel = (
    <div className="space-y-7">
      <section aria-live="polite">
        <p className="m-0 text-sm font-semibold text-ink-soft">{t('organ.selected')}</p>
        <p className="mt-1 mb-0 text-2xl font-bold text-ink">
          {selectedLabel ? localize(selectedLabel) : t('organ.none')}
        </p>
        <p className="mt-2 mb-0 text-sm text-ink-soft">{t('organ.hint')}</p>
      </section>

      <section>
        <p className="mt-0 mb-1 text-sm font-semibold text-ink-soft">{t('organ.explode')}</p>
        <Slider min={0} max={1} step={0.01} value={explode} onChange={setExplode} tooltip={{ open: false }} />
        <label className="mt-2 flex cursor-pointer items-center gap-3 text-ink-soft">
          <Switch size="small" checked={isIsolated} onChange={setIsIsolated} />
          {t('organ.isolate')}
        </label>
      </section>

      <section>
        <h2 className="m-0 text-lg font-bold text-purple-ink">{t('organ.parts')}</h2>
        <ul className="mt-3 mb-0 grid gap-1 pl-0">
          {structures.map(({ node, label }) => (
            <li key={node}>
              <Button
                type={node === selected ? 'primary' : 'text'}
                className="h-auto w-full justify-start py-1.5 text-left whitespace-normal"
                onClick={() => setSelected(node === selected ? null : node)}
                onMouseEnter={() => setHovered(node)}
                onMouseLeave={() => setHovered(null)}
              >
                {localize(label)}
              </Button>
            </li>
          ))}
        </ul>
      </section>

      {credit && (
        <p className="m-0 border-t border-grid-strong pt-4 text-xs text-ink-soft">{t('organ.credit', { credit })}</p>
      )}
    </div>
  )

  return (
    <LabShell
      title={localize(model.name)}
      lessonLabel={lessonLabel}
      toolbar={toolbar}
      scene={
        <OrganScene
          path={model.path}
          structures={structures}
          selected={selected}
          hovered={hovered}
          explode={explode}
          isIsolated={isIsolated}
          onHover={setHovered}
          onSelect={setSelected}
        />
      }
      panel={panel}
    />
  )
}

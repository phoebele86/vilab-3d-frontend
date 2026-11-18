import { Alert, Radio, Segmented, Slider, Tag } from 'antd'
import { useTranslation } from 'react-i18next'

import {
  getObjectPosition,
  OBJECT_POSITIONS,
  type LensImage,
  type LensSetup,
  type LensType,
} from '@/features/physics/lens/lensOptics'
import { RAY_COLORS } from '@/features/physics/lens/rayColors'

const LENS_TYPES: LensType[] = ['converging', 'diverging']

const RAY_LEGEND = [
  { key: 'parallel', labelKey: 'lens.rayParallel' },
  { key: 'center', labelKey: 'lens.rayCenter' },
  { key: 'focal', labelKey: 'lens.rayFocal' },
] as const

const getImageTraits = ({ isReal, magnification }: LensImage) => {
  const size = Math.abs(magnification)
  const sizeKey = Math.abs(size - 1) < 0.01 ? 'sameSize' : size > 1 ? 'larger' : 'smaller'
  return [isReal ? 'real' : 'virtual', magnification < 0 ? 'inverted' : 'upright', sizeKey] as const
}

type LensPanelProps = {
  setup: LensSetup
  image: LensImage | null
  onChange: (patch: Partial<LensSetup>) => void
}

export const LensPanel = ({ setup, image, onChange }: LensPanelProps) => {
  const { t, i18n } = useTranslation()
  const { focalLength: f, objectDistance: d } = setup
  const formatNumber = (value: number) =>
    new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 1 }).format(value)

  return (
    <div className="space-y-7">
      <section>
        <h2 className="m-0 text-lg font-bold text-purple-ink">{t('lens.lensType')}</h2>
        <Segmented<LensType>
          className="mt-3"
          block
          value={setup.lensType}
          onChange={(lensType) => onChange({ lensType })}
          options={LENS_TYPES.map((lensType) => ({ label: t(`lens.${lensType}`), value: lensType }))}
        />
      </section>

      <section>
        <h2 className="m-0 text-lg font-bold text-purple-ink">{t('lens.objectPosition')}</h2>
        <Radio.Group
          className="mt-3 flex flex-wrap gap-y-2"
          optionType="button"
          value={getObjectPosition(setup)}
          onChange={({ target }) => {
            const position = OBJECT_POSITIONS.find(({ key }) => key === target.value)
            if (position) onChange({ objectDistance: position.factor * f })
          }}
          options={OBJECT_POSITIONS.map(({ key, label }) => ({ label, value: key }))}
        />
        <p className="mt-5 mb-1 text-sm font-semibold text-ink-soft">
          {t('lens.objectDistance', { value: formatNumber(d) })}
        </p>
        <Slider
          min={1}
          max={45}
          step={0.5}
          value={d}
          onChange={(objectDistance) => onChange({ objectDistance })}
          marks={{ [f]: 'f', [2 * f]: '2f' }}
          tooltip={{ formatter: (value) => `${value} cm` }}
        />
        <p className="mt-4 mb-1 text-sm font-semibold text-ink-soft">{t('lens.focalLength', { value: f })}</p>
        <Slider min={5} max={20} step={1} value={f} onChange={(focalLength) => onChange({ focalLength })} />
        <p className="mt-4 mb-1 text-sm font-semibold text-ink-soft">
          {t('lens.objectHeight', { value: formatNumber(setup.objectHeight) })}
        </p>
        <Slider
          min={1}
          max={6}
          step={0.5}
          value={setup.objectHeight}
          onChange={(objectHeight) => onChange({ objectHeight })}
        />
      </section>

      <section aria-live="polite">
        <h2 className="m-0 text-lg font-bold text-purple-ink">{t('lens.result')}</h2>
        {image ? (
          <>
            <div className="mt-3 flex flex-wrap gap-2">
              {getImageTraits(image).map((trait) => (
                <Tag key={trait} color="purple" className="m-0 text-sm">
                  {t(`lens.image.${trait}`)}
                </Tag>
              ))}
            </div>
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
              <dt className="text-ink-soft">{t('lens.imageDistance')}</dt>
              <dd className="m-0 font-semibold">
                {formatNumber(Math.abs(image.distance))} cm{' '}
                {image.isReal ? t('lens.behindLens') : t('lens.sameSideAsObject')}
              </dd>
              <dt className="text-ink-soft">{t('lens.imageHeight')}</dt>
              <dd className="m-0 font-semibold">{formatNumber(Math.abs(image.height))} cm</dd>
              <dt className="text-ink-soft">{t('lens.magnification')}</dt>
              <dd className="m-0 font-semibold">
                {t('lens.timesObject', { value: formatNumber(Math.abs(image.magnification)) })}
              </dd>
            </dl>
            {Math.abs(image.distance) > 60 && <p className="mt-3 mb-0 text-sm text-ink-soft">{t('lens.outOfView')}</p>}
          </>
        ) : (
          <Alert className="mt-3" type="info" showIcon message={t('lens.noImage')} />
        )}
      </section>

      <section>
        <h2 className="m-0 text-lg font-bold text-purple-ink">{t('lens.rays')}</h2>
        <ul className="mt-3 mb-0 space-y-2 pl-0">
          {RAY_LEGEND.map(({ key, labelKey }) => (
            <li key={key} className="flex items-center gap-3">
              <span aria-hidden="true" className="h-1 w-8 rounded-full" style={{ backgroundColor: RAY_COLORS[key] }} />
              {t(labelKey)}
            </li>
          ))}
        </ul>
        <p className="mt-3 mb-0 text-sm text-ink-soft">{t('lens.rayHint')}</p>
      </section>
    </div>
  )
}

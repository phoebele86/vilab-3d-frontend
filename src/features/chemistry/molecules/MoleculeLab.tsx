import { Bounds, OrbitControls } from '@react-three/drei'
import { Alert, Radio, Switch } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { SceneCanvas } from '@/components/common/SceneCanvas'
import { SceneNotice } from '@/components/common/SceneNotice'
import { LabShell } from '@/components/layout/LabShell'
import { getElementStyle, ROMAN_NUMERALS } from '@/features/chemistry/elements'
import { Formula } from '@/features/chemistry/Formula'
import { MoleculeModel } from '@/features/chemistry/MoleculeModel'
import { getElementFacts } from '@/features/chemistry/molecules/moleculeFacts'
import { useChemistryErrorMessage, useMolecule } from '@/features/chemistry/queries'
import { useLocalizedText } from '@/hooks/useLocalizedText'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import type { LabProps } from '@/types/lab'

const readFormulas = (config: Record<string, unknown>) =>
  Array.isArray(config.formulas) ? config.formulas.filter((item): item is string => typeof item === 'string') : []

export const MoleculeLab = ({ model, lessonLabel, toolbar }: LabProps) => {
  const { t } = useTranslation()
  const localize = useLocalizedText()
  const getErrorMessage = useChemistryErrorMessage()
  const formulas = readFormulas(model.config)
  // Bond count equals valence only for the common substances listed in the lesson
  const showValence = model.config.showValence === true
  const [selected, setSelected] = useState(formulas.at(0) ?? 'H2O')
  const [showLabels, setShowLabels] = useState(true)
  const reducedMotion = usePrefersReducedMotion()
  const { data: molecule, error, isPending } = useMolecule(selected)

  const scene = molecule ? (
    <SceneCanvas camera={{ position: [0, 0, 6], fov: 40 }} dpr={[1, 2]} gl={{ alpha: true }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 8]} intensity={1.6} />
      <Bounds key={molecule.formula} fit clip margin={2.2}>
        <MoleculeModel structure={molecule.structure} showLabels={showLabels} />
      </Bounds>
      <OrbitControls makeDefault autoRotate={!reducedMotion} autoRotateSpeed={1.2} enablePan={false} />
    </SceneCanvas>
  ) : (
    <SceneNotice text={isPending ? t('molecules.loading') : t('molecules.failed')} />
  )

  const panel = (
    <div className="space-y-7">
      <section>
        <h2 className="m-0 text-lg font-bold text-purple-ink">{t('molecules.choose')}</h2>
        <Radio.Group
          className="mt-3 flex flex-wrap gap-y-2"
          optionType="button"
          value={selected}
          onChange={({ target }) => setSelected(target.value)}
          options={formulas.map((formula) => ({ label: <Formula value={formula} />, value: formula }))}
        />
        <label className="mt-4 flex cursor-pointer items-center gap-3 text-ink-soft">
          <Switch size="small" checked={showLabels} onChange={setShowLabels} />
          {t('molecules.showSymbols')}
        </label>
      </section>

      {error && <Alert type="warning" showIcon message={getErrorMessage(error)} />}

      {molecule && (
        <section aria-live="polite">
          <h2 className="m-0 text-2xl font-bold text-ink">
            <Formula value={molecule.formula} />
          </h2>
          <p className="mt-1 mb-0 text-ink-soft">{localize(molecule.name)}</p>
          <table className="mt-5 w-full border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-grid-strong text-sm text-ink-soft">
                <th className="py-2 font-semibold">{t('molecules.element')}</th>
                <th className="py-2 font-semibold">{t('molecules.atomCount')}</th>
                <th className="py-2 font-semibold">
                  {showValence ? t('molecules.bondCountWithValence') : t('molecules.bondCount')}
                </th>
              </tr>
            </thead>
            <tbody>
              {getElementFacts(molecule.structure).map(({ symbol, count, bondsPerAtom }) => (
                <tr key={symbol} className="border-b border-grid-strong">
                  <td className="py-2">
                    <span
                      aria-hidden="true"
                      className="mr-2 inline-block size-3 rounded-full align-middle"
                      style={{ backgroundColor: getElementStyle(symbol).color }}
                    />
                    {symbol} ({getElementStyle(symbol).name})
                  </td>
                  <td className="py-2 font-semibold">{count}</td>
                  <td className="py-2 font-semibold">
                    {bondsPerAtom}
                    {showValence && ` (${ROMAN_NUMERALS.at(bondsPerAtom)})`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 mb-0 text-sm text-ink-soft">{t('molecules.bondHint')}</p>
        </section>
      )}
    </div>
  )

  return (
    <LabShell title={localize(model.name)} lessonLabel={lessonLabel} toolbar={toolbar} scene={scene} panel={panel} />
  )
}

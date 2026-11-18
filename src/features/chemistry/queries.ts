import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { getApiFailure, getJson, postJson } from '@/lib/api'
import type { MoleculeDetail, ReactionDetail } from '@/types/api'

export const useMolecule = (formula: string | null) =>
  useQuery({
    queryKey: ['molecule', formula],
    queryFn: () => getJson<MoleculeDetail>(`/molecules/${encodeURIComponent(formula ?? '')}`),
    enabled: formula !== null,
    staleTime: Infinity,
  })

// The backend caches balanced reactions, so a POST here is a safe, repeatable read.
export const useReaction = (equation: string | null) =>
  useQuery({
    queryKey: ['reaction', equation],
    queryFn: () => postJson<ReactionDetail>('/chemistry/reaction', { equation }),
    enabled: equation !== null,
    staleTime: Infinity,
    retry: false,
  })

// Maps the backend's stable error codes to messages in the current language.
export const useChemistryErrorMessage = () => {
  const { t } = useTranslation()

  return (error: unknown) => {
    const detail = getApiFailure(error)?.detail
    switch (detail?.code) {
      case 'invalid_formula':
        return t('reaction.errors.invalidFormula', { formula: String(detail.formula) })
      case 'invalid_equation':
        return t('reaction.errors.invalidEquation')
      case 'unbalanceable':
        return t('reaction.errors.unbalanceable')
      case 'unknown_molecule': {
        const formulas = Array.isArray(detail.formulas) ? detail.formulas.join(', ') : detail.formula
        return t('reaction.errors.unknownMolecule', { formulas: String(formulas) })
      }
      default:
        return t('reaction.errors.fallback')
    }
  }
}

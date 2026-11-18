type FormulaProps = {
  value: string
  className?: string
}

export const Formula = ({ value, className }: FormulaProps) => (
  <span className={className}>
    {value.split(/(\d+)/).map((part, index) => (/^\d+$/.test(part) ? <sub key={index}>{part}</sub> : part))}
  </span>
)

// "CH4 + 2O2 -> CO2 + 2H2O": leading digits are coefficients, the rest are subscripts.
export const EquationText = ({ value, className }: FormulaProps) => {
  const [left = '', right = ''] = value.split('->')
  const renderSide = (side: string) =>
    side
      .split('+')
      .map((species) => species.trim().match(/^(\d*)(.+)$/))
      .map((match, index) => (
        <span key={index}>
          {index > 0 && ' + '}
          {match?.at(1)}
          <Formula value={match?.at(2) ?? ''} />
        </span>
      ))

  return (
    <span className={className}>
      {renderSide(left)} → {renderSide(right)}
    </span>
  )
}

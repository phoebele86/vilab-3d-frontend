type ElementStyle = {
  color: string
  // Ball-and-stick display radius in Å, smaller than the van der Waals radius so bonds stay visible
  radius: number
  name: string
}

const ELEMENTS: Record<string, ElementStyle> = {
  H: { color: '#f4f5f0', radius: 0.25, name: 'Hydrogen' },
  C: { color: '#5c6370', radius: 0.36, name: 'Carbon' },
  N: { color: '#5b8def', radius: 0.35, name: 'Nitrogen' },
  O: { color: '#e0605a', radius: 0.35, name: 'Oxygen' },
  S: { color: '#f5c451', radius: 0.42, name: 'Sulfur' },
  Cl: { color: '#7fd6a4', radius: 0.42, name: 'Chlorine' },
}

export const getElementStyle = (symbol: string): ElementStyle =>
  ELEMENTS[symbol] ?? { color: '#c4a7f5', radius: 0.38, name: symbol }

export const ROMAN_NUMERALS = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII']

const IRREGULAR_PLURALS: Record<string, string> = {
  person: 'people',
  man: 'men',
  woman: 'women',
  child: 'children',
  tooth: 'teeth',
  foot: 'feet',
  mouse: 'mice',
  goose: 'geese',
  ox: 'oxen',
  leaf: 'leaves',
  life: 'lives',
  knife: 'knives',
  wife: 'wives',
  half: 'halves',
  wolf: 'wolves',
  loaf: 'loaves',
  potato: 'potatoes',
  tomato: 'tomatoes',
  hero: 'heroes',
  echo: 'echoes',
  cactus: 'cacti',
  focus: 'foci',
  fungus: 'fungi',
  nucleus: 'nuclei',
  syllabus: 'syllabi',
  analysis: 'analyses',
  diagnosis: 'diagnoses',
  oasis: 'oases',
  thesis: 'theses',
  crisis: 'crises',
  phenomenon: 'phenomena',
  criterion: 'criteria',
  datum: 'data',
}
const UNCOUNTABLE_OR_INVARIANT: Set<string> = new Set([
  'fish',
  'sheep',
  'deer',
  'series',
  'species',
  'aircraft',
  'moose',
  'shrimp',
  'trout',
  'spacecraft',
  'water',
  'information',
  'equipment',
  'rice',
  'money',
])

export function getEnglishPlural(word: string): string {
  const lowerWord = word.toLowerCase()

  if (UNCOUNTABLE_OR_INVARIANT.has(lowerWord)) {
    return word
  }
  if (IRREGULAR_PLURALS[lowerWord]) {
    const plural = IRREGULAR_PLURALS[lowerWord]
    if (word[0] === word[0].toUpperCase()) {
      return plural.charAt(0).toUpperCase() + plural.slice(1)
    }
    return plural
  }

  if (/(s|x|z|ch|sh)$/i.test(word)) {
    return word + 'es'
  }
  if (/[^aeiou]y$/i.test(word)) {
    return word.slice(0, -1) + 'ies'
  }
  return word + 's'
}

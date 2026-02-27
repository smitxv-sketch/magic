const TRANSLITMAP: Record<string, string> = {
  а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'zh',з:'z',и:'i',
  й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',
  у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'sch',ъ:'',ы:'y',
  ь:'',э:'e',ю:'yu',я:'ya',' ':'_'
};

export function generateBooleanKey(label: string): string {
  const transliterated = label
    .toLowerCase()
    .split('')
    .map(c => TRANSLITMAP[c] ?? c)
    .join('')
    .replace(/[^a-z0-9_]/g, '')
    .replace(/_+/g, '_')
    .slice(0, 50); // Increased limit slightly
  return `has_${transliterated}`;
}

import { Language } from '../types';

/**
 * Month names localized for Marathi, Hindi, and English
 */
const MONTH_NAMES: Record<Language, string[]> = {
  mr: [
    'जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून',
    'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'
  ],
  hi: [
    'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
  ],
  en: [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]
};

/**
 * Converts English digits (0-9) into Marathi/Devanagari numerals if requested
 */
export const toDevanagariNumerals = (str: string | number): string => {
  const devanagariDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return String(str).replace(/[0-9]/g, (digit) => devanagariDigits[parseInt(digit, 10)]);
};

export interface FormatDateOptions {
  /**
   * 'numeric': DD/MM/YYYY (or MM/DD/YYYY)
   * 'textual': e.g., "1 ऑगस्ट 2026"
   * 'short': e.g., "01 Aug"
   */
  style?: 'numeric' | 'textual' | 'short';
  /**
   * Whether to include the 12-hour time (e.g., 02:30 PM)
   */
  includeTime?: boolean;
  /**
   * Force explicit order: 'DD/MM/YYYY' (Default for Indian locale / Marathi / Hindi) or 'MM/DD/YYYY'
   */
  order?: 'DD/MM/YYYY' | 'MM/DD/YYYY';
}

/**
 * Main helper function to format dates based on selected Language state.
 * Standard Indian agricultural portals (AgmarkNet, Govt of Maharashtra, Mandis)
 * use DD/MM/YYYY format.
 */
export function formatDateByLanguage(
  dateInput: Date | string | number | null | undefined,
  language: Language = 'mr',
  options: FormatDateOptions = {}
): string {
  if (!dateInput) return '';

  const date = typeof dateInput === 'string' || typeof dateInput === 'number'
    ? new Date(dateInput)
    : dateInput;

  if (isNaN(date.getTime())) {
    return String(dateInput);
  }

  const day = date.getDate();
  const month = date.getMonth() + 1; // 1-12
  const year = date.getFullYear();

  const dayStr = day < 10 ? `0${day}` : `${day}`;
  const monthStr = month < 10 ? `0${month}` : `${month}`;
  const yearStr = `${year}`;

  const { style = 'numeric', includeTime = false, order = 'DD/MM/YYYY' } = options;

  let formattedDate = '';

  if (style === 'textual') {
    const monthName = MONTH_NAMES[language][date.getMonth()];
    if (language === 'mr') {
      formattedDate = `${day} ${monthName} ${year}`;
    } else if (language === 'hi') {
      formattedDate = `${day} ${monthName} ${year}`;
    } else {
      formattedDate = `${day} ${monthName} ${year}`;
    }
  } else if (style === 'short') {
    const monthName = MONTH_NAMES[language][date.getMonth()];
    formattedDate = `${day} ${monthName}`;
  } else {
    // Numeric style: DD/MM/YYYY vs MM/DD/YYYY
    if (order === 'MM/DD/YYYY') {
      formattedDate = `${monthStr}/${dayStr}/${yearStr}`;
    } else {
      // Default DD/MM/YYYY for Indian farmers
      formattedDate = `${dayStr}/${monthStr}/${yearStr}`;
    }
  }

  // Format time if requested
  if (includeTime) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12
    const hoursStr = hours < 10 ? `0${hours}` : `${hours}`;
    const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    
    const timeStr = `${hoursStr}:${minutesStr} ${ampm}`;
    formattedDate = `${formattedDate}, ${timeStr}`;
  }

  return formattedDate;
}

/**
 * Returns the localized date format string hint for input fields or badges (e.g. "DD/MM/YYYY" or "दिनांक/महिना/वर्ष")
 */
export function getDateFormatHint(language: Language): string {
  switch (language) {
    case 'mr':
      return 'दिवस/महिना/वर्ष (DD/MM/YYYY)';
    case 'hi':
      return 'दिन/महीना/वर्ष (DD/MM/YYYY)';
    case 'en':
    default:
      return 'DD/MM/YYYY';
  }
}

/**
 * Formats relative date or current date for AgmarkNet updates
 */
export function getLocalizedTodayDate(language: Language, style: 'numeric' | 'textual' = 'textual'): string {
  return formatDateByLanguage(new Date(), language, { style });
}

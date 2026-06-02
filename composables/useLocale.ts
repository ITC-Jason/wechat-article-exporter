import enUSMessages from '~/locales/en-US.json';
import zhCNMessages from '~/locales/zh-CN.json';

export type AppLocale = 'zh-CN' | 'en-US';

type LocaleMessages = Record<string, unknown>;
type TranslationParams = Record<string, string | number | boolean | null | undefined>;

const STORAGE_KEY = 'app-locale';
const DEFAULT_LOCALE: AppLocale = 'zh-CN';
const messages: Record<AppLocale, LocaleMessages> = {
  'zh-CN': zhCNMessages,
  'en-US': enUSMessages,
};

function isAppLocale(value: string | null): value is AppLocale {
  return value === 'zh-CN' || value === 'en-US';
}

function getMessage(source: LocaleMessages, key: string): string | undefined {
  const value = key.split('.').reduce<unknown>((current, segment) => {
    if (current && typeof current === 'object' && segment in current) {
      return (current as Record<string, unknown>)[segment];
    }
    return undefined;
  }, source);

  return typeof value === 'string' ? value : undefined;
}

function interpolate(template: string, params: TranslationParams = {}) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(params[key] ?? ''));
}

export function useLocale() {
  const locale = useState<AppLocale>('app-locale', () => DEFAULT_LOCALE);

  if (import.meta.client) {
    onMounted(() => {
      const savedLocale = localStorage.getItem(STORAGE_KEY);
      if (isAppLocale(savedLocale)) {
        locale.value = savedLocale;
      }
    });

    watch(locale, value => {
      localStorage.setItem(STORAGE_KEY, value);
    });
  }

  const currentLocaleName = computed(() => t('common.localeName'));
  const nextLocaleName = computed(
    () => getMessage(messages[locale.value === 'zh-CN' ? 'en-US' : 'zh-CN'], 'common.localeName') ?? ''
  );

  function setLocale(value: AppLocale) {
    locale.value = value;
  }

  function toggleLocale() {
    locale.value = locale.value === 'zh-CN' ? 'en-US' : 'zh-CN';
  }

  function t(key: string, params?: TranslationParams) {
    const template = getMessage(messages[locale.value], key) ?? getMessage(messages[DEFAULT_LOCALE], key) ?? key;
    return interpolate(template, params);
  }

  return {
    locale,
    currentLocaleName,
    nextLocaleName,
    setLocale,
    toggleLocale,
    t,
  };
}

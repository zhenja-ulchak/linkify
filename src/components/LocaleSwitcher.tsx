'use client';

import { useLocale, useTranslations } from 'next-intl';
import LocaleSwitcherSelect from './LocaleSwitcherSelect';

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale(); // Получаем текущую локаль

  // Обработчик изменения локали
  const handleLocaleChange = (newLocale: string) => {
    localStorage.setItem('locale', newLocale); // Сохраняем выбранную локаль в localStorage
    // Перезагружаем страницу для применения новой локали
    window.location.reload();
  };

  return (
    <LocaleSwitcherSelect
      defaultValue={locale}
      items={[
        { value: 'en', label: t('en') },
        { value: 'de', label: t('de') },
        { value: 'ua', label: t('ua') },
        { value: 'ru', label: t('ru') }
      ]}
      label={t('label')}
      onLocaleChange={handleLocaleChange}
    />
  );
}

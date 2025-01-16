"use client";

import { CheckIcon, LanguageIcon } from "@heroicons/react/24/solid";
import * as Select from "@radix-ui/react-select";
import { useTransition } from "react";
import { Locale } from "@/i18n/config";
import { setUserLocale } from "@/services/locale"; // Функция для смены локали в вашем приложении

type Props = {
  defaultValue: string;
  items: Array<{ value: string; label: string; shortLabel: string }>; // Добавляем shortLabel для сокращения
  label: string;
  onLocaleChange: (newLocale: string) => void;
};

export default function LocaleSwitcherSelect({
  defaultValue,
  items,
  label,
  onLocaleChange,
}: Props) {
  const [isPending, startTransition] = useTransition();

  // Обработчик изменения локали
  function onChange(value: string) {
    const locale = value as Locale;
    startTransition(() => {
      setUserLocale(locale); // Устанавливаем локаль с помощью вашей функции
      onLocaleChange(locale); // Вызываем переданный колбэк для перезагрузки страницы
    });
  }

  return (
    <div style={{ position: "relative" }}>
      <Select.Root defaultValue={defaultValue} onValueChange={onChange}>
        <Select.Trigger
          aria-label={label}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px",
            borderRadius: "4px",
            cursor: "pointer",
            backgroundColor: isPending ? "#f0f0f0" : "#fff",
            opacity: isPending ? 0.6 : 1,
            border: "1px solid #ccc",
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          }}
        >
          <Select.Icon>
            <LanguageIcon
              style={{
                width: "24px",
                height: "24px",
                color: "#4b5563", // Tailwind equivalent text-slate-600
              }}
            />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            align="end"
            style={{
              minWidth: "8rem",
              overflow: "hidden",
              borderRadius: "4px",
              backgroundColor: "#fff",
              padding: "8px 0",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            }}
            position="popper"
          >
            <Select.Viewport>
              {items.map((item) => (
                <Select.Item
                  key={item.value}
                  value={item.value}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 16px",
                    fontSize: "14px",
                    cursor: "default",
                    backgroundColor:
                      item.value === defaultValue ? "#f0f0f0" : "transparent",
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  }}
                >
                  <div style={{ marginRight: "8px", width: "16px" }}>
                    {item.value === defaultValue && (
                      <CheckIcon
                        style={{
                          width: "20px",
                          height: "20px",
                        }}
                      />
                    )}
                  </div>
                  <span style={{ color: "#111827" }}>
                    <span style={{ fontSize: "12px", marginRight: "4px" }}>
                      {item.shortLabel} {/* Сокращение с меньшим размером */}
                    </span>
                    {item.label} {/* Полное название языка */}
                  </span>
                </Select.Item>
              ))}
            </Select.Viewport>
            <Select.Arrow
              style={{
                fill: "#fff",
                color: "#fff",
              }}
            />
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}

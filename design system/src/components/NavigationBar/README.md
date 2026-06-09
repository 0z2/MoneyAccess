# NavigationBar

Навигационная панель страницы с заголовком. В десктопной версии находится слева на странице интернет‑банка и поддерживает хлебные крошки, шаги и кнопки действий; в адаптивном — компактную шапку с иконочными кнопками.

Режим выбирается через проп `isAdaptive`.

---

## Десктопный режим (`isAdaptive: false`)

### Контент и варианты

| Проп | Тип | По умолчанию | Описание |
|---|---|---|---|
| `title` | `React.ReactNode` | — | Основной заголовок панели (обязательный) |
| `description` | `React.ReactNode` | — | Вспомогательный текст под заголовком |
| `rootLinkLabel` | `React.ReactNode` | — | Текст верхней breadcrumb-ссылки |
| `items` | `NavigationBarItem[]` | `[]` | Массив элементов навигации: ссылки (`link`) или шаги (`step`) |
| `backButtonLabel` | `string` | `'Go back'` | Aria-метка кнопки «Назад» |
| `actionButtonLabel` | `string` | `'Clear'` | Aria-метка кнопки действия |
| `backButtonIcon` | `React.ReactNode` | `ArrowLeft` | Иконка кнопки «Назад» |
| `actionButtonIcon` | `React.ReactNode` | `Broom` | Иконка кнопки действия |
| `className` | `string` | `''` | Дополнительные CSS классы |

### Показ/скрытие элементов

| Проп | Тип | По умолчанию | Описание |
|---|---|---|---|
| `hasBackButton` | `boolean` | `true` | Показывает кнопку «Назад» |
| `hasActionButton` | `boolean` | `true` | Показывает кнопку действия |
| `hasRootLink` | `boolean` | `true` | Показывает breadcrumb-ссылку, даже если `rootLinkLabel` передан |
| `hasDescription` | `boolean` | `true` | Показывает описание, даже если `description` передан |

### Состояние

| Проп | Тип | По умолчанию | Описание |
|---|---|---|---|
| `onBackClick` | `() => void` | — | Колбэк при клике на кнопку «Назад» |
| `onActionClick` | `() => void` | — | Колбэк при клике на кнопку действия |
| `onRootLinkClick` | `() => void` | — | Колбэк при клике на breadcrumb-ссылку |

---

**`NavigationBarLinkItem`** (`kind: 'link'`):

| Поле | Тип | Описание |
|---|---|---|
| `label` | `React.ReactNode` | Текст ссылки |
| `href` | `string` | URL для перехода |
| `onClick` | `() => void` | Колбэк по клику |
| `isDisabled` | `boolean` | Блокирует элемент |

**`NavigationBarStepItem`** (`kind: 'step'`):

| Поле | Тип | Описание |
|---|---|---|
| `label` | `React.ReactNode` | Текст шага |
| `state` | `'current' \| 'upcoming'` | Состояние шага |

---

## Адаптивный режим (`isAdaptive: true`)

### Контент и варианты

| Проп | Тип | По умолчанию | Описание |
|---|---|---|---|
| `titleVariant` | `'none' \| 'title' \| 'title-description' \| 'step-progress' \| 'percent-progress' \| 'image'` | `'title'` | Вариант центральной зоны |
| `title` | `React.ReactNode` | — | Заголовок (для `title` и `title-description`) |
| `description` | `React.ReactNode` | — | Описание под заголовком (для `title-description`) |
| `logo` | `React.ReactNode` | — | Логотип (для `image`) |
| `progress` | `NavigationBarAdaptiveProgress` | — | Настройки прогресса (для `step-progress` и `percent-progress`) |
| `leftIcon` | `React.ReactNode` | `ArrowLeft` | Иконка левой кнопки |
| `leftAriaLabel` | `string` | `'Go back'` | Aria-метка левой кнопки |
| `rightAccessoryVariant` | `'none' \| 'icon' \| 'icon-icon' \| 'icon-badge' \| 'action'` | `'icon'` | Вариант правой зоны |
| `rightIcon` | `React.ReactNode` | `Broom` | Иконка правой кнопки |
| `secondaryRightIcon` | `React.ReactNode` | — | Иконка второй правой кнопки (для `icon-icon`) |
| `rightAriaLabel` | `string` | `'Action'` | Aria-метка правой кнопки |
| `secondaryRightAriaLabel` | `string` | `'Secondary action'` | Aria-метка второй правой кнопки |
| `actionLabel` | `React.ReactNode` | `'Text M'` | Текст кнопки-ссылки (для `action`) |
| `badgeValue` | `number` | `0` | Значение бейджа (для `icon-badge`) |
| `className` | `string` | `''` | Дополнительные CSS классы |

### Показ/скрытие элементов

| Проп | Тип | По умолчанию | Описание |
|---|---|---|---|
| `isInverted` | `boolean` | `false` | Инвертирует цвета: текст и иконки становятся белыми |

### Состояние

| Проп | Тип | По умолчанию | Описание |
|---|---|---|---|
| `onLeftClick` | `() => void` | — | Колбэк при клике на левую кнопку |
| `onRightClick` | `() => void` | — | Колбэк при клике на правую кнопку |
| `onSecondaryRightClick` | `() => void` | — | Колбэк при клике на вторую правую кнопку |

---

**`NavigationBarAdaptiveProgress`:**

| Поле | Тип | Описание |
|---|---|---|
| `value` | `number` | Текущее значение прогресса (обязательный) |
| `maxSteps` | `number` | Общее количество шагов (для `step-progress`) |
| `ariaLabel` | `string` | Aria-метка для доступности |

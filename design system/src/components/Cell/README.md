# Cell

Универсальная строка списка с заголовком, опциональным описанием, левым и правым аксессуарами. Используется для отображения данных, настроек, навигации и любых структурированных списков.

Для стандартных паттернов рекомендуется использовать `CellLeftAccessory` и `CellRightAccessory`. `Cell` также принимает любой кастомный `ReactNode`.

## Props

### Контент и варианты

| Проп | Тип | По умолчанию | Описание |
|---|---|---|---|
| `title` | `React.ReactNode` | — | Заголовок ячейки |
| `subtitle` | `React.ReactNode` | — | Подзаголовок над заголовком |
| `description` | `React.ReactNode` | — | Описание под заголовком |
| `leftAccessory` | `React.ReactNode` | `Avatar` | Элемент слева. По умолчанию — `Avatar` |
| `rightAccessory` | `React.ReactNode` | `ChevronRight` | Элемент справа. По умолчанию — иконка `ChevronRight` |
| `titleColor` | `string` | `var(--primitive-primary)` | Цвет заголовка |
| `subtitleColor` | `string` | `var(--primitive-secondary)` | Цвет подзаголовка |
| `descriptionColor` | `string` | `var(--primitive-secondary)` | Цвет описания |
| `className` | `string` | `''` | Дополнительный CSS-класс |

### Показ/скрытие элементов

| Проп | Тип | По умолчанию | Описание |
|---|---|---|---|
| `hasLeftAccessory` | `boolean` | `true` | Показывает левый аксессуар |
| `hasRightAccessory` | `boolean` | `true` | Показывает правый аксессуар |

### Состояние

| Проп | Тип | По умолчанию | Описание |
|---|---|---|---|
| `onClick` | `() => void` | — | Колбэк по клику. При наличии ячейка становится интерактивной |

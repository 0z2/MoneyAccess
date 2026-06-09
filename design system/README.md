# T Design System

React компонент-библиотека для T Design System.

## Установка

### Требования
- React 16.8+
- React DOM 16.8+

Пакет публикуется в GitHub Packages. Перед установкой добавь registry для scope `@pluginwoman`:

```bash
npm config set @pluginwoman:registry https://npm.pkg.github.com
npm install @pluginwoman/t-ds
```

Подключи стили библиотеки один раз в корневом файле приложения:

```tsx
import '@pluginwoman/t-ds/style'
```

## Использование

### Импорт компонентов

```tsx
import { Badge, Button, Input, Switch } from '@pluginwoman/t-ds'
import { CircleIcon } from '@pluginwoman/t-ds/icons'
import '@pluginwoman/t-ds/style'

export function App() {
  return (
    <>
      <Button variant="primary">Нажми меня</Button>
      <Input placeholder="Введи текст" />
      <Switch />
      <Badge value={3} />
      <CircleIcon />
    </>
  )
}
```

### Публичные entrypoints

- `@pluginwoman/t-ds` — компоненты библиотеки
- `@pluginwoman/t-ds/icons` — SVG-иконки
- `@pluginwoman/t-ds/style` — общие стили библиотеки

### Стили и токены

Пакет поставляется с CSS-переменными для цветов, типографики, отступов, скруглений, теней и иконок. Для корректной работы компонентов достаточно один раз импортировать:

```tsx
import '@pluginwoman/t-ds/style'
```

### Иконки

Иконки экспортируются отдельно из `@pluginwoman/t-ds/icons`:

```tsx
import { CircleIcon } from '@pluginwoman/t-ds/icons'

export function Example() {
  return <CircleIcon />
}
```

### Доступные компоненты

- **AccordeonCell** — ячейка с раскрывающимся содержимым
- **ActionFormCell** — ячейка формы с действием
- **ActionSheet** — нижняя панель действий
- **Avatar** — аватар пользователя
- **Badge** — бейдж количества
- **Button** — кнопка с вариантами (primary, secondary, transparent, white)
- **Cell** — базовая ячейка списка
- **CellLeftAccessory** — левый аксессуар ячейки
- **CellRightAccessory** — правый аксессуар ячейки
- **Checkbox** — чекбокс
- **Chip** — чип/тег с опциональной иконкой
- **ContextMenu** — контекстное меню
- **Drawer** — выезжающая панель
- **Dropdown** — выпадающий список
- **FeedbackBanner** — баннер обратной связи
- **Footer** — фиксированный подвал страницы с кнопками действий
- **FormCell** — ячейка формы со свитчером, чекбоксом или радио
- **HeaderButton** — кнопка или группа кнопок под заголовком страницы
- **Input** — текстовое поле ввода
- **LinearProgress** — линейный индикатор прогресса
- **MainPageNavigationBar** — главная навигационная панель сайта
- **Modal** — модальное окно
- **NavigationBar** — навигационная панель страницы с заголовком
- **PageAction** — строка действия или перехода на странице
- **PromoPageBanner** — крупный визуальный блок-шапка для промо-страниц
- **PromoPageCard** — карточка для контентного наполнения промо-страниц
- **PromoPageHorizontalCard** — горизонтальная карточка на всю ширину для промо-страниц
- **Radio** — радиокнопка для единичного выбора
- **Spinner** — анимированный индикатор загрузки
- **Switch** — переключатель между двумя состояниями
- **Tag** — метка статуса или категории
- **TextArea** — многострочное поле ввода
- **Tooltip** — всплывающая подсказка
- **Widget** — блок-контейнер с заголовком и зоной для контента
- **WidgetTitle** — шапка виджета с заголовком и правым аксессуаром

## Лицензия

MIT — используй как хочешь в своих проектах

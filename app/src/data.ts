// Мок-данные и логика прототипа мониторинга.
// Никаких внешних API — всё генерируется детерминированно.

export type ActionType = 'auth' | 'view' | 'payment' | 'settings' | 'documents' | 'export';

export interface Action {
  id: string;
  t: number;
  date: Date;
  type: ActionType;
  label: string;
  detail: string;
  susp: string | null; // причина, если действие подозрительное
}

export interface Employee {
  id: string;
  name: string;
  initials: string;
  role: string;
  sign: boolean;
  online: boolean;
  current?: { label: string; type: ActionType };
  lastVisit?: Date;
  actions: Action[];
}

export const TYPE_LABEL: Record<ActionType, string> = {
  auth: 'Авторизация',
  view: 'Просмотр',
  payment: 'Платёж',
  settings: 'Настройки',
  documents: 'Документы',
  export: 'Экспорт',
};
export const TYPE_ORDER: ActionType[] = ['auth', 'view', 'payment', 'settings', 'documents', 'export'];

/* ===== Даты ===== */
export const NOW = new Date(2026, 5, 9, 17, 50); // 9 июня 2026, вт
export const WD = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
export const pad = (n: number) => String(n).padStart(2, '0');
export const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const dmy = (d: Date) => `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
export const hm = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
export const hmFloat = (h: number) => `${pad(Math.floor(h))}:${pad(Math.round((h % 1) * 60))}`;
export const dayOffset = (n: number) => {
  const d = new Date(NOW);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d;
};
export function dayHead(d: Date) {
  const t = dayOffset(0), y = dayOffset(1);
  let prefix = '';
  if (ymd(d) === ymd(t)) prefix = 'Сегодня, ';
  else if (ymd(d) === ymd(y)) prefix = 'Вчера, ';
  return `${prefix}${WD[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/* ===== PRNG ===== */
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ===== Шаблоны действий ===== */
const POOL: Record<ActionType, [string, string][]> = {
  auth: [
    ['Вход в интернет-банк', 'Десктоп, Москва'],
    ['Выход из интернет-банка', 'Десктоп, Москва'],
    ['Вход в интернет-банк', 'Мобильное устройство, Московская область'],
  ],
  view: [
    ['Просмотр выписки по счёту', 'Счёт •• 5402'],
    ['Просмотр истории операций', 'Период: текущий месяц'],
    ['Просмотр контрагентов', 'ООО «Ромашка»'],
    ['Просмотр баланса по счетам', '3 счёта'],
    ['Просмотр входящих платежей', 'За сегодня'],
  ],
  payment: [
    ['Создание платежа по реквизитам', 'ООО «Ромашка», 45 000 ₽'],
    ['Платёж контрагенту', 'ИП Соколов, 12 300 ₽'],
    ['Оплата налога', 'НДФЛ, 89 200 ₽'],
    ['Создание платежа по реквизитам', 'ООО «ТехСнаб», 7 800 ₽'],
  ],
  settings: [
    ['Изменение настроек уведомлений', 'Email-уведомления'],
    ['Просмотр настроек профиля', '—'],
  ],
  documents: [
    ['Работа в онлайн-бухгалтерии', 'УСН, 2 кв. 2026'],
    ['Заполнение КУДиР', 'Книга учёта доходов и расходов'],
    ['Формирование декларации', 'Декларация по УСН'],
  ],
  export: [
    ['Экспорт выписки', 'PDF'],
    ['Выгрузка в 1С', '1C, период: май 2026'],
  ],
};
const WEIGHTS: ActionType[] = ['view', 'view', 'view', 'payment', 'view', 'documents', 'payment', 'view', 'export', 'view', 'documents', 'view'];

let UID = 0;
function mkAct(date: Date, hour: number, type: ActionType, tpl: [string, string], susp?: string): Action {
  const d = new Date(date);
  d.setHours(Math.floor(hour), Math.round((hour % 1) * 60), 0, 0);
  return { id: 'a' + UID++, t: d.getTime(), date: d, type, label: tpl[0], detail: tpl[1], susp: susp || null };
}

function genDay(rnd: () => number, date: Date, count: number, suspList?: ((d: Date) => Action)[]): Action[] {
  const acts: Action[] = [];
  acts.push(mkAct(date, 8.6 + rnd() * 0.8, 'auth', POOL.auth[0]));
  for (let i = 0; i < count; i++) {
    const h = 9 + rnd() * 8.5;
    const t = WEIGHTS[Math.floor(rnd() * WEIGHTS.length)];
    const tpl = POOL[t][Math.floor(rnd() * POOL[t].length)];
    acts.push(mkAct(date, h, t, tpl));
  }
  acts.push(mkAct(date, 13 + rnd() * 0.5, 'auth', POOL.auth[1]));
  acts.push(mkAct(date, 13.7 + rnd() * 0.4, 'auth', POOL.auth[0]));
  acts.push(mkAct(date, 17.7 + rnd() * 0.6, 'auth', POOL.auth[1]));
  (suspList || []).forEach((s) => acts.push(s(date)));
  acts.sort((a, b) => a.t - b.t);
  return acts;
}

function buildPetrova(): Action[] {
  const rnd = mulberry32(101);
  let all: Action[] = [];
  for (let off = 29; off >= 0; off--) {
    const date = dayOffset(off);
    const dow = date.getDay();
    const weekend = dow === 0 || dow === 6;
    if (weekend) {
      if (rnd() < 0.5) continue;
      all = all.concat(genDay(rnd, date, 2 + Math.floor(rnd() * 3)));
      continue;
    }
    const heavy = off <= 6;
    const count = heavy ? 15 + Math.floor(rnd() * 9) : 6 + Math.floor(rnd() * 6);
    let susp: ((d: Date) => Action)[] | undefined;
    if (off === 0) {
      susp = [(d) => mkAct(d, 11.02, 'payment', ['Массовая отправка платежей', '12 платежей за 3 минуты'], 'Массовые операции: 12 платежей за 3 минуты (нетипично для пользователя)')];
    } else if (off === 1) {
      susp = [(d) => mkAct(d, 2.78, 'auth', ['Вход в интернет-банк', 'Десктоп, Москва'], 'Авторизация в 02:47 — вход в нерабочее время')];
    } else if (off === 4) {
      susp = [(d) => mkAct(d, 9.4, 'auth', ['Вход в интернет-банк', 'Десктоп, Новосибирская область'], 'Вход из Новосибирской области (обычный регион: Москва и МО)')];
    }
    all = all.concat(genDay(rnd, date, count, susp));
  }
  return all;
}

function buildSimple(seed: number, days: number[]): Action[] {
  const rnd = mulberry32(seed);
  let all: Action[] = [];
  days.forEach((off) => {
    all = all.concat(genDay(rnd, dayOffset(off), 4 + Math.floor(rnd() * 4)));
  });
  return all;
}

export const EMPLOYEES: Employee[] = [
  {
    id: 'petrova', name: 'Петрова Анна Сергеевна', initials: 'ПА', role: 'Бухгалтер', sign: false,
    online: true, current: { label: 'Платежи → По реквизитам', type: 'payment' }, actions: buildPetrova(),
  },
  {
    id: 'kozlov', name: 'Козлов Дмитрий Игоревич', initials: 'КД', role: 'Финансовый директор', sign: true,
    online: true, current: { label: 'Аналитика', type: 'view' }, actions: buildSimple(202, [0, 1, 2]),
  },
  {
    id: 'sidorova', name: 'Сидорова Елена Владимировна', initials: 'СЕ', role: 'Помощник', sign: false,
    online: false, lastVisit: new Date(2026, 5, 9, 14, 23), actions: buildSimple(303, [0, 1]),
  },
  {
    id: 'novikov', name: 'Новиков Алексей Петрович', initials: 'НА', role: 'Бухгалтер', sign: false,
    online: false, lastVisit: new Date(2026, 5, 8, 18, 1), actions: buildSimple(404, [1, 2]),
  },
];

/* ===== Таймлайн: кластеризация активности по дням ===== */
export interface Segment { start: number; end: number; cnt: number; susp: number; }
export interface DayRow { date: Date; segs: Segment[]; }

export function buildSegments(actions: Action[], daysBack: number, markedSet: Set<string>): DayRow[] {
  const byDay: Record<string, Action[]> = {};
  actions.forEach((a) => {
    (byDay[ymd(a.date)] = byDay[ymd(a.date)] || []).push(a);
  });
  const rows: DayRow[] = [];
  for (let off = 0; off < daysBack; off++) {
    const date = dayOffset(off);
    const acts = (byDay[ymd(date)] || []).slice().sort((a, b) => a.t - b.t);
    const segs: Segment[] = [];
    if (acts.length) {
      let start = acts[0].date.getHours() + acts[0].date.getMinutes() / 60;
      let end = start, cnt = 0, susp = 0;
      const flush = () => segs.push({ start, end: Math.min(24, end + 0.25), cnt, susp });
      acts.forEach((a, i) => {
        const h = a.date.getHours() + a.date.getMinutes() / 60;
        if (i > 0 && h - end > 0.75) { flush(); start = h; cnt = 0; susp = 0; }
        end = h; cnt++;
        if (a.susp || markedSet.has(a.id)) susp++;
      });
      flush();
    }
    rows.push({ date, segs });
  }
  return rows;
}

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
  status: 'ok' | 'declined';
  declineReason?: string;
  amount?: number; // сумма платежа, ₽ (только для type: 'payment')
  // Для входов (type: 'auth', label «Вход…»)
  ip?: string;
  city?: string;
  device?: string;
  geoOk?: boolean;
}

export interface Employee {
  id: string;
  name: string;
  initials: string;
  role: string;
  sign: boolean; // право подписи — только такие сотрудники могут проводить платежи
  products: string[];
  limit: number | null; // лимит на операцию, ₽ (null — лимит не задан / платежей нет)
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
export const rub = (n: number) => n.toLocaleString('ru-RU') + ' ₽';
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
interface Net { ip: string; city: string; device: string }

const POOL: Record<Exclude<ActionType, 'payment'>, [string, string][]> = {
  auth: [
    ['Вход в интернет-банк', 'Десктоп'],
    ['Выход из интернет-банка', 'Десктоп'],
  ],
  view: [
    ['Просмотр выписки по счёту', 'Счёт •• 5402'],
    ['Просмотр истории операций', 'Период: текущий месяц'],
    ['Просмотр контрагентов', 'ООО «Ромашка»'],
    ['Просмотр баланса по счетам', '3 счёта'],
    ['Просмотр входящих платежей', 'За сегодня'],
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
const PAYMENTS: [string, string, number][] = [
  ['Создание платежа по реквизитам', 'ООО «Ромашка»', 45000],
  ['Платёж контрагенту', 'ИП Соколов', 12300],
  ['Оплата налога', 'НДФЛ', 89200],
  ['Создание платежа по реквизитам', 'ООО «ТехСнаб»', 7800],
];
const WEIGHTS: ActionType[] = ['view', 'view', 'view', 'payment', 'view', 'documents', 'payment', 'view', 'export', 'view', 'documents', 'view'];

let UID = 0;
function mkAct(date: Date, hour: number, type: ActionType, label: string, detail: string, extra?: Partial<Action>): Action {
  const d = new Date(date);
  d.setHours(Math.floor(hour), Math.round((hour % 1) * 60), 0, 0);
  return {
    id: 'a' + UID++, t: d.getTime(), date: d, type, label, detail,
    susp: null, status: 'ok', ...extra,
  };
}

function mkLogin(net: Net, date: Date, hour: number, out = false, extra?: Partial<Action>): Action {
  return mkAct(
    date, hour, 'auth',
    out ? 'Выход из интернет-банка' : 'Вход в интернет-банк',
    `${net.device.startsWith('Chrome') || net.device.startsWith('Safari') || net.device.startsWith('Firefox') ? 'Десктоп' : 'Мобильное устройство'}, ${net.city}`,
    out ? undefined : { ip: net.ip, city: net.city, device: net.device, geoOk: true, ...extra },
  );
}

function genDay(rnd: () => number, net: Net, canPay: boolean, date: Date, count: number, suspList?: ((d: Date) => Action)[]): Action[] {
  const acts: Action[] = [];
  acts.push(mkLogin(net, date, 8.6 + rnd() * 0.8));
  // Люди работают блоками: сортируем времена и раздаём типы сериями по 1–4 действия —
  // так на таймлайне видны осмысленные «кусочки» занятий.
  const hours = Array.from({ length: count }, () => 9 + rnd() * 8.5).sort((a, b) => a - b);
  let i = 0;
  while (i < count) {
    let t = WEIGHTS[Math.floor(rnd() * WEIGHTS.length)];
    if (t === 'payment' && !canPay) t = 'view'; // без права подписи платежей нет
    const blockLen = 1 + Math.floor(rnd() * 4);
    for (let j = 0; j < blockLen && i < count; j++, i++) {
      const h = hours[i];
      if (t === 'payment') {
        const p = PAYMENTS[Math.floor(rnd() * PAYMENTS.length)];
        acts.push(mkAct(date, h, 'payment', p[0], `${p[1]}, ${rub(p[2])}`, { amount: p[2] }));
      } else {
        const tpl = POOL[t][Math.floor(rnd() * POOL[t].length)];
        acts.push(mkAct(date, h, t, tpl[0], tpl[1]));
      }
    }
  }
  acts.push(mkLogin(net, date, 13 + rnd() * 0.5, true));
  acts.push(mkLogin(net, date, 13.7 + rnd() * 0.4));
  acts.push(mkLogin(net, date, 17.7 + rnd() * 0.6, true));
  (suspList || []).forEach((s) => acts.push(s(date)));
  acts.sort((a, b) => a.t - b.t);
  return acts;
}

function buildPetrova(net: Net): Action[] {
  const rnd = mulberry32(101);
  let all: Action[] = [];
  for (let off = 29; off >= 0; off--) {
    const date = dayOffset(off);
    const dow = date.getDay();
    const weekend = dow === 0 || dow === 6;
    if (weekend) {
      if (rnd() < 0.5) continue;
      all = all.concat(genDay(rnd, net, true, date, 2 + Math.floor(rnd() * 3)));
      continue;
    }
    const heavy = off <= 6;
    const count = heavy ? 15 + Math.floor(rnd() * 9) : 6 + Math.floor(rnd() * 6);
    let susp: ((d: Date) => Action)[] | undefined;
    if (off === 0) {
      susp = [(d) => mkAct(d, 11.02, 'payment', 'Массовая отправка платежей', `12 платежей за 3 минуты, ${rub(540000)}`, {
        amount: 540000,
        susp: 'Массовые операции: 12 платежей за 3 минуты (нетипично для пользователя)',
      })];
    } else if (off === 1) {
      susp = [(d) => mkAct(d, 2.78, 'auth', 'Вход в интернет-банк', 'Десктоп, Москва', {
        ip: net.ip, city: net.city, device: net.device, geoOk: true,
        susp: 'Авторизация в 02:47 — вход в нерабочее время',
      })];
    } else if (off === 5) {
      susp = [(d) => mkAct(d, 15.32, 'payment', 'Платёж контрагенту', `ООО «Вектор-Плюс», ${rub(250000)}`, {
        amount: 250000,
        status: 'declined',
        declineReason: 'Отклонено: превышен лимит на операцию (лимит 100 000 ₽)',
        susp: 'Попытка платежа выше установленного лимита',
      })];
    } else if (off === 4) {
      susp = [(d) => mkAct(d, 9.4, 'auth', 'Вход в интернет-банк', 'Десктоп, Новосибирская область', {
        ip: '178.49.112.7', city: 'Новосибирск', device: 'Firefox · Windows 10', geoOk: false,
        susp: 'Вход из Новосибирской области (обычный регион: Москва и МО)',
      })];
    }
    all = all.concat(genDay(rnd, net, true, date, count, susp));
  }
  return all;
}

function buildSimple(seed: number, net: Net, canPay: boolean, days: number[]): Action[] {
  const rnd = mulberry32(seed);
  let all: Action[] = [];
  days.forEach((off) => {
    all = all.concat(genDay(rnd, net, canPay, dayOffset(off), 4 + Math.floor(rnd() * 4)));
  });
  return all;
}

export const EMPLOYEES: Employee[] = [
  {
    id: 'petrova', name: 'Петрова Анна Сергеевна', initials: 'ПА', role: 'Бухгалтер', sign: true,
    products: ['Платежи', 'Выписки', 'Контрагенты'], limit: 100000,
    online: true, current: { label: 'Платежи → По реквизитам', type: 'payment' },
    actions: buildPetrova({ ip: '95.79.42.18', city: 'Москва', device: 'Chrome · Windows 11' }),
  },
  {
    id: 'kozlov', name: 'Козлов Дмитрий Игоревич', initials: 'КД', role: 'Финансовый директор', sign: true,
    products: ['Платежи', 'Выписки', 'Аналитика', 'Депозиты'], limit: null,
    online: true, current: { label: 'Аналитика', type: 'view' },
    actions: buildSimple(202, { ip: '212.45.8.101', city: 'Москва', device: 'Safari · macOS' }, true, [0, 1, 2]),
  },
  {
    id: 'sidorova', name: 'Сидорова Елена Владимировна', initials: 'СЕ', role: 'Помощник', sign: false,
    products: ['Выписки', 'Контрагенты'], limit: null,
    online: false, lastVisit: new Date(2026, 5, 9, 14, 23),
    actions: buildSimple(303, { ip: '95.79.40.91', city: 'Москва', device: 'Chrome · Windows 11' }, false, [0, 1]),
  },
  {
    id: 'novikov', name: 'Новиков Алексей Петрович', initials: 'НА', role: 'Бухгалтер', sign: false,
    products: ['Выписки', 'Онлайн-бухгалтерия'], limit: null,
    online: false, lastVisit: new Date(2026, 5, 8, 18, 1),
    actions: buildSimple(404, { ip: '78.107.233.4', city: 'Подольск', device: 'Chrome · Windows 11' }, false, [1, 2]),
  },
];

/* ===== Входы (для вкладки «IP и география») ===== */
export const loginsOf = (e: Employee) =>
  e.actions.filter((a) => a.type === 'auth' && a.ip).sort((a, b) => b.t - a.t);

/* ===== Сводки по сотруднику за период ===== */
export function summarize(e: Employee, from: Date, to: Date, checked: Set<string>) {
  let acts = 0, paid = 0, susp = 0, unviewed = 0;
  let last: Date | null = null;
  e.actions.forEach((a) => {
    if (a.date < from || a.date > to) return;
    acts++;
    if (a.type === 'payment' && a.status === 'ok' && a.amount) paid += a.amount;
    if (a.susp) {
      susp++;
      if (!checked.has(a.id)) unviewed++;
    }
    if (!last || a.date > last) last = a.date;
  });
  return { acts, paid, susp, unviewed, last: last as Date | null };
}

/* ===== Распределение действий по типам («чем занимался») ===== */
export function typeShares(e: Employee, from: Date, to: Date): { type: ActionType; cnt: number; share: number }[] {
  const cnt = new Map<ActionType, number>();
  let total = 0;
  e.actions.forEach((a) => {
    if (a.date < from || a.date > to) return;
    cnt.set(a.type, (cnt.get(a.type) || 0) + 1);
    total++;
  });
  if (!total) return [];
  return TYPE_ORDER
    .filter((t) => cnt.get(t))
    .map((t) => ({ type: t, cnt: cnt.get(t)!, share: cnt.get(t)! / total }))
    .sort((a, b) => b.cnt - a.cnt);
}

/* ===== Распределение времени по типам занятий (для пай-чарта «Рабочее время») ===== */
export function timeByType(e: Employee, from: Date, to: Date): { type: ActionType; hours: number; share: number }[] {
  const rows = buildSegments(e.actions, 30);
  const acc = new Map<ActionType, number>();
  let total = 0;
  rows.forEach((r) => {
    if (r.date < from || r.date > to) return;
    r.segs.forEach((s) => {
      const d = s.end - s.start;
      acc.set(s.type, (acc.get(s.type) || 0) + d);
      total += d;
    });
  });
  if (!total) return [];
  return TYPE_ORDER
    .filter((t) => acc.get(t))
    .map((t) => ({ type: t, hours: acc.get(t)!, share: acc.get(t)! / total }))
    .sort((a, b) => b.hours - a.hours);
}

/* ===== Входы по городам (для пай-чарта «IP и география») ===== */
export function cityShares(e: Employee, from: Date, to: Date): { city: string; cnt: number; share: number }[] {
  const logins = e.actions.filter((a) => a.type === 'auth' && a.ip && a.date >= from && a.date <= to);
  const acc = new Map<string, number>();
  logins.forEach((l) => acc.set(l.city!, (acc.get(l.city!) || 0) + 1));
  const total = logins.length;
  if (!total) return [];
  return [...acc.entries()]
    .map(([city, cnt]) => ({ city, cnt, share: cnt / total }))
    .sort((a, b) => b.cnt - a.cnt);
}

/* ===== Склонение ===== */
export function plural(n: number, one: string, few: string, many: string) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}

/* ===== Таймлайн: кластеризация активности по дням, с разбивкой по типам занятий ===== */
export interface Segment { start: number; end: number; cnt: number; susp: number; type: ActionType; }
export interface DayRow { date: Date; segs: Segment[]; }

export function buildSegments(actions: Action[], daysBack: number): DayRow[] {
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
      let type: ActionType = acts[0].type;
      const counts = new Map<ActionType, number>();
      const flush = () => {
        // тип сегмента — преобладающее занятие внутри кластера
        let best: ActionType = type, bestN = 0;
        counts.forEach((n, t) => { if (n > bestN) { bestN = n; best = t; } });
        segs.push({ start, end: Math.min(24, end + 0.25), cnt, susp, type: best });
        counts.clear();
      };
      acts.forEach((a, i) => {
        const h = a.date.getHours() + a.date.getMinutes() / 60;
        // новый кусочек: разрыв по времени ИЛИ человек переключился на другой тип занятия
        if (i > 0 && (h - end > 0.75 || a.type !== type)) { flush(); start = h; cnt = 0; susp = 0; }
        type = a.type;
        end = h; cnt++;
        counts.set(a.type, (counts.get(a.type) || 0) + 1);
        if (a.susp) susp++;
      });
      flush();
      // не даём соседним кусочкам наезжать друг на друга из-за хвостового паддинга
      for (let k = 0; k < segs.length - 1; k++) {
        if (segs[k].end > segs[k + 1].start) segs[k].end = segs[k + 1].start;
      }
    }
    rows.push({ date, segs });
  }
  return rows;
}

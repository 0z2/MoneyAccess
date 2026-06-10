import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  MainPageNavigationBar,
  NavigationBar,
  Widget,
  Avatar,
  Cell,
  Chip,
  Checkbox,
  Tag,
  Button,
} from '@tds';
import {
  Key, Eye, Card, Gear, DocumentList, DocumentListAcsArrowDownOutgoing,
  WarningTriangle, Person, Speedometer,
  Integration, Puzzle, Calendar, Filters, Bell, CheckmarkCircle, Cross,
} from '@tds/icons';
import {
  EMPLOYEES, TYPE_LABEL, TYPE_ORDER, NOW, WD,
  dayOffset, ymd, dmy, hm, hmFloat, dayHead, buildSegments, loginsOf, summarize, typeShares, rub,
  type Action, type ActionType, type Employee,
} from './data';

/* ===== helpers ===== */
const Icon: React.FC<{ icon: React.ReactNode; size?: string; color?: string }> = ({ icon, size = 'm', color }) => (
  <span className={`ds-icon ds-icon--${size}`} style={color ? { color } : undefined}>{icon}</span>
);

const TYPE_ICON: Record<ActionType, React.ReactNode> = {
  auth: <Key />, view: <Eye />, payment: <Card />, settings: <Gear />,
  documents: <DocumentList />, export: <DocumentListAcsArrowDownOutgoing />,
};

// Цвета занятий — для таймлайна и диаграммы «чем занимался»
const TYPE_COLOR: Record<ActionType, string> = {
  auth: '#98a2b3',
  view: 'var(--primitive-brand)',
  payment: '#2f9e44',
  settings: '#74808f',
  documents: '#1c7ed6',
  export: '#e8590c',
};

/* ===== Sidebar ===== */
const NAV = [
  { ico: <Person />, label: 'Доступы' },
  { ico: <Speedometer />, label: 'Мониторинг', active: true },
  { ico: <Integration />, label: 'Интеграции и API' },
  { ico: <Puzzle />, label: 'Подключить 1С' },
];
const Sidebar: React.FC = () => (
  <aside className="sidebar">
    <div className="sidebar__title ts-400-xs">Доступы</div>
    {NAV.map((it, i) => (
      <button key={i} className={'nav-item' + (it.active ? ' active' : '')}>
        <Icon icon={it.ico} size="s" />
        <span className="ts-500-s">{it.label}</span>
      </button>
    ))}
  </aside>
);

/* ===== Employee table ===== */
const EmployeeTable: React.FC<{
  range: [Date, Date];
  periodLabel: string;
  empId: string;
  checked: Set<string>;
  onSelect: (id: string) => void;
}> = ({ range, periodLabel, empId, checked, onSelect }) => {
  const [from, to] = range;
  const rows = EMPLOYEES.map((e) => ({ e, s: summarize(e, from, to, checked) }));

  return (
    <div className="card emp-table-card">
      <div className="emp-table-head">
        <div>
          <div className="ts-600-m">Сотрудники</div>
          <div className="emp-table-sub ts-400-xs">Период: {periodLabel.toLowerCase()}</div>
        </div>
      </div>
      <table className="emp-table">
        <thead>
          <tr className="ts-400-xs">
            <th>Сотрудник</th>
            <th>Статус</th>
            <th>Доступ</th>
            <th className="num">Действия</th>
            <th className="num">Платежи</th>
            <th>Риски</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ e, s }) => (
            <tr
              key={e.id}
              className={e.id === empId ? 'active' : ''}
              onClick={() => onSelect(e.id)}
            >
              <td>
                <div className="emp-cell">
                  <Avatar
                    label={e.initials} size="m" shape="superellipse"
                    style={{ '--avatar-surface': 'var(--bg-brand-2)', '--avatar-color': 'var(--primitive-brand)' } as React.CSSProperties}
                  />
                  <div>
                    <div className="ts-500-s">{e.name.split(' ').slice(0, 2).join(' ')}</div>
                    <div className="emp-cell__role ts-400-xs">{e.role}</div>
                  </div>
                </div>
              </td>
              <td>
                <div className="emp-status ts-400-xs">
                  <span className={'dot ' + (e.online ? 'dot--on' : 'dot--off')} />
                  {e.online
                    ? <span>Онлайн · {e.current!.label}</span>
                    : <span>Был(а) {dmy(e.lastVisit!)}, {hm(e.lastVisit!)}</span>}
                </div>
              </td>
              <td>
                <Tag size="s" variant={e.sign ? 'filled' : 'outlined'}>
                  {e.sign ? 'С правом подписи' : 'Без права подписи'}
                </Tag>
              </td>
              <td className="num ts-500-s">{s.acts || '—'}</td>
              <td className="num ts-500-s">{e.sign ? (s.paid ? rub(s.paid) : '—') : '—'}</td>
              <td>
                {s.unviewed > 0 ? (
                  <span className="risk-pill risk-pill--alert ts-500-xs">
                    <Icon icon={<WarningTriangle />} size="2xs" />
                    {s.unviewed} новых
                  </span>
                ) : s.susp > 0 ? (
                  <span className="risk-pill risk-pill--checked ts-500-xs">
                    <Icon icon={<CheckmarkCircle />} size="2xs" />
                    {s.susp} проверено
                  </span>
                ) : (
                  <span className="risk-none ts-400-xs">Нет</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ===== Донат «чем занимался» ===== */
const Donut: React.FC<{ shares: { type: ActionType; cnt: number; share: number }[]; total: number }> = ({ shares, total }) => {
  const R = 30, SW = 11;
  const C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <div className="donut-wrap">
      <svg width="84" height="84" viewBox="0 0 84 84">
        <circle cx="42" cy="42" r={R} fill="none" stroke="var(--bg-neutral-2)" strokeWidth={SW} />
        {shares.map((s) => {
          const dash = s.share * C;
          const el = (
            <circle
              key={s.type}
              cx="42" cy="42" r={R} fill="none"
              stroke={TYPE_COLOR[s.type]} strokeWidth={SW}
              strokeDasharray={`${dash} ${C - dash}`}
              strokeDashoffset={-acc}
              transform="rotate(-90 42 42)"
            />
          );
          acc += dash;
          return el;
        })}
        <text x="42" y="40" textAnchor="middle" className="donut-num">{total}</text>
        <text x="42" y="52" textAnchor="middle" className="donut-cap">действий</text>
      </svg>
      <div className="donut-legend">
        {shares.slice(0, 4).map((s) => (
          <div key={s.type} className="donut-legend__row ts-400-xs">
            <i style={{ background: TYPE_COLOR[s.type] }} />
            <span>{TYPE_LABEL[s.type]}</span>
            <b>{Math.round(s.share * 100)}%</b>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ===== Панель выбранного сотрудника ===== */
const EmployeePanel: React.FC<{ emp: Employee; range: [Date, Date]; periodLabel: string; checked: Set<string> }> = ({ emp, range, periodLabel, checked }) => {
  const today = summarize(emp, dayOffset(0), NOW, checked);
  const shares = useMemo(() => typeShares(emp, range[0], range[1]), [emp, range]);
  const total = shares.reduce((s, x) => s + x.cnt, 0);
  return (
    <div className="card emp-panel">
      <div className="emp-panel__id">
        <Avatar
          label={emp.initials} size="l" shape="superellipse"
          style={{ '--avatar-surface': 'var(--bg-brand-2)', '--avatar-color': 'var(--primitive-brand)' } as React.CSSProperties}
        />
        <div>
          <div className="emp-panel__cap ts-500-xs">Выбранный сотрудник</div>
          <div className="ts-600-m">{emp.name.split(' ').slice(0, 2).join(' ')}</div>
          <div className="emp-cell__role ts-400-xs">{emp.role} · {emp.sign ? 'с правом подписи' : 'без права подписи'}</div>
        </div>
      </div>
      <div className="emp-panel__col">
        <div className="emp-panel__lbl ts-400-xs">Доступы к продуктам</div>
        <div className="ts-500-s">{emp.products.join(', ')}</div>
      </div>
      <div className="emp-panel__col">
        <div className="emp-panel__lbl ts-400-xs">Лимит на операцию</div>
        <div className="ts-500-s">{emp.sign ? (emp.limit ? `до ${rub(emp.limit)}` : 'Без лимита') : '—'}</div>
      </div>
      <div className="emp-panel__col">
        <div className="emp-panel__lbl ts-400-xs">Сегодня</div>
        <div className="ts-500-s">
          {today.acts} действий{today.susp > 0 && <> · <span className={today.unviewed ? 'txt-alert' : ''}>рисков: {today.susp}</span></>}
        </div>
      </div>
      <div className="emp-panel__col emp-panel__donut">
        <div className="emp-panel__lbl ts-400-xs">Чем занимался · {periodLabel.toLowerCase()}</div>
        {shares.length ? <Donut shares={shares} total={total} /> : <div className="ts-400-s" style={{ color: 'var(--primitive-neutral-4)' }}>Нет данных</div>}
      </div>
      <div className="emp-panel__actions">
        <Button variant="secondary" size="s">Изменить права</Button>
        <Button variant="primary" size="s">Управлять доступом</Button>
      </div>
    </div>
  );
};

/* ===== Type filter popover ===== */
const TypeFilter: React.FC<{ selected: ActionType[]; onChange: (v: ActionType[]) => void }> = ({ selected, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const count = selected.length;
  const label = count === 0 || count === TYPE_ORDER.length ? 'Все типы' : `Типы: ${count}`;
  const toggle = (t: ActionType) => {
    const s = new Set(selected);
    s.has(t) ? s.delete(t) : s.add(t);
    onChange([...s]);
  };
  return (
    <div className="dropdown-wrap" ref={ref}>
      <Chip variant="dropdown" isOpen={open} leftAccessory="icon" leftIcon={<Filters />} onClick={() => setOpen((o) => !o)}>
        {label}
      </Chip>
      {open && (
        <div className="menu">
          {TYPE_ORDER.map((t) => (
            <div key={t} className="menu__item" onClick={() => toggle(t)}>
              <Checkbox isChecked={selected.includes(t)} onChange={() => toggle(t)} />
              <Icon icon={TYPE_ICON[t]} size="xs" color="var(--primitive-secondary)" />
              <span className="ts-400-s">{TYPE_LABEL[t]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ===== Action row ===== */
const ActionRow: React.FC<{
  a: Action;
  isChecked: boolean;
  onToggleCheck: (id: string) => void;
}> = ({ a, isChecked, onToggleCheck }) => {
  const isSusp = !!a.susp;
  const declined = a.status === 'declined';
  return (
    <div className={'act-row' + (isSusp ? ' susp' : '')}>
      <Cell
        hasLeftAccessory
        hasRightAccessory
        leftAccessory={
          <Avatar
            size="m" shape="superellipse" icon={<Icon icon={TYPE_ICON[a.type]} size="s" />}
            style={{
              '--avatar-surface': declined ? 'var(--bg-error-1, #fdecec)' : isSusp ? 'var(--bg-warning-2)' : 'var(--bg-neutral-2)',
              '--avatar-color': declined ? 'var(--primitive-error, #d43d3d)' : isSusp ? '#8a6d12' : 'var(--primitive-secondary)',
            } as React.CSSProperties}
          />
        }
        title={<span className="ts-500-s">{a.label}</span>}
        description={<span className="ts-400-xs">{a.detail}</span>}
        rightAccessory={
          <div className="act-right">
            <span className="act-meta">
              {declined && <span className="status-tag status-tag--declined ts-500-xs">Отклонено</span>}
              <span className={`tag-tint tag-tint--${a.type} ts-500-xs`}>{TYPE_LABEL[a.type]}</span>
              <span className="act-time ts-400-s">{hm(a.date)}</span>
            </span>
            {isSusp && (
              <span className="act-mark">
                <Chip
                  variant="action"
                  leftAccessory="icon"
                  leftIcon={isChecked ? <Cross /> : <CheckmarkCircle />}
                  onClick={() => onToggleCheck(a.id)}
                >
                  {isChecked ? 'Снять «проверено»' : 'Проверено'}
                </Chip>
              </span>
            )}
          </div>
        }
      />
      {declined && (
        <div className="act-reason-line act-reason-line--declined ts-400-xs">
          <Icon icon={<Cross />} size="2xs" color="var(--primitive-error, #d43d3d)" />
          <span>{a.declineReason}</span>
        </div>
      )}
      {a.susp && (
        <div className="act-reason-line ts-400-xs">
          <Icon icon={isChecked ? <CheckmarkCircle /> : <WarningTriangle />} size="2xs" color={isChecked ? 'var(--primitive-success, #2f9e44)' : '#c79a14'} />
          <span>{a.susp}{isChecked ? ' · проверено' : ''}</span>
        </div>
      )}
    </div>
  );
};

/* ===== Timeline ===== */
const HOURS = [0, 3, 6, 9, 12, 15, 18, 21, 24];
const fmtH = (h: number) => `${Math.floor(h)}ч ${Math.round((h % 1) * 60)}мин`;

const HourAxis: React.FC<{ labelWidth?: number }> = ({ labelWidth = 76 }) => (
  <div className="tl-axis" style={{ marginLeft: labelWidth }}>
    {HOURS.slice(0, -1).map((h) => <span key={h}>{('0' + h).slice(-2)}:00</span>)}
  </div>
);

type Tip = { x: number; y: number; text: string } | null;

const Track: React.FC<{
  segs: { start: number; end: number; cnt: number; susp: number; type: ActionType }[];
  setTip: (t: Tip) => void;
}> = ({ segs, setTip }) => (
  <div className="tl-track">
    {HOURS.map((h) => <i key={h} style={{ left: (h / 24 * 100) + '%' }} />)}
    {segs.map((s, j) => {
      const text = `${TYPE_LABEL[s.type]} · ${hmFloat(s.start)}–${hmFloat(s.end)}, ${s.cnt} действ.${s.susp ? `, ${s.susp} подозрит.` : ''}`;
      return (
        <div
          key={j}
          className={'tl-seg' + (s.susp ? ' tl-seg--susp' : '')}
          style={{
            left: (s.start / 24 * 100) + '%',
            width: ((s.end - s.start) / 24 * 100) + '%',
            background: s.susp ? undefined : TYPE_COLOR[s.type],
          }}
          onMouseEnter={(e) => setTip({ x: e.clientX, y: e.clientY, text })}
          onMouseMove={(e) => setTip({ x: e.clientX, y: e.clientY, text })}
          onMouseLeave={() => setTip(null)}
        />
      );
    })}
  </div>
);

const TypeLegend: React.FC = () => (
  <div className="tl-legend ts-400-xs">
    {TYPE_ORDER.map((t) => (
      <span key={t}><i style={{ background: TYPE_COLOR[t] }} /> {TYPE_LABEL[t]}</span>
    ))}
    <span><i style={{ background: 'var(--primitive-warning)' }} /> Подозрительное</span>
  </div>
);

const TimelineBody: React.FC<{ emp: Employee; range: 'week' | 'month' }> = ({ emp, range }) => {
  const [tip, setTip] = useState<Tip>(null);
  const daysBack = range === 'week' ? 7 : 30;
  const rows = useMemo(() => buildSegments(emp.actions, daysBack), [emp, daysBack]);

  const active = rows.filter((r) => r.segs.length);
  const dur = active.map((r) => ({ date: r.date, d: r.segs.reduce((s, x) => s + (x.end - x.start), 0) }));
  const avg = dur.length ? dur.reduce((s, x) => s + x.d, 0) / dur.length : 0;
  const best = dur.slice().sort((a, b) => b.d - a.d)[0];

  return (
    <>
      <div className="tl-stats">
        <div className="stat"><div className="stat__lbl ts-400-xs">Среднее время в ИБ за день</div><div className="stat__val ts-600-xl">{fmtH(avg)}</div></div>
        <div className="stat"><div className="stat__lbl ts-400-xs">Самый активный день</div><div className="stat__val ts-600-l">{best ? `${WD[best.date.getDay()]}, ${('0' + best.date.getDate()).slice(-2)}.${('0' + (best.date.getMonth() + 1)).slice(-2)} — ${fmtH(best.d)}` : '—'}</div></div>
        <div className="stat"><div className="stat__lbl ts-400-xs">Обычные часы работы</div><div className="stat__val ts-600-xl">9:00–18:00</div></div>
      </div>

      <div className="tl-grid">
        <HourAxis />
        <div>
          {rows.map((r, i) => (
            <div className="tl-row" key={i}>
              <div className="tl-row__lbl ts-400-xs"><b>{('0' + r.date.getDate()).slice(-2)}.{('0' + (r.date.getMonth() + 1)).slice(-2)}</b> {WD[r.date.getDay()]}</div>
              <Track segs={r.segs} setTip={setTip} />
            </div>
          ))}
        </div>
        <TypeLegend />
      </div>

      {tip && <div className="tl-tip" style={{ left: tip.x + 12, top: tip.y + 12 }}>{tip.text}</div>}
    </>
  );
};

/* ===== Общий борд: вся команда ===== */
const TeamBoard: React.FC<{ range: 'week' | 'month' }> = ({ range }) => {
  const [tip, setTip] = useState<Tip>(null);
  const daysBack = range === 'week' ? 7 : 30;
  const data = useMemo(() => EMPLOYEES.map((e) => {
    const rows = buildSegments(e.actions, daysBack);
    const dur = rows.filter((r) => r.segs.length).map((r) => r.segs.reduce((s, x) => s + (x.end - x.start), 0));
    const avg = dur.length ? dur.reduce((s, x) => s + x, 0) / dur.length : 0;
    const today = rows[0].segs;
    const todayH = today.reduce((s, x) => s + (x.end - x.start), 0);
    return { e, today, todayH, avg };
  }), [daysBack]);

  return (
    <div className="tl-grid">
      <div className="team-axis-note ts-400-xs">Сегодня, {dmy(NOW)} · по часам</div>
      <HourAxis labelWidth={180} />
      <div>
        {data.map(({ e, today, todayH, avg }) => (
          <div className="tl-row team-row" key={e.id}>
            <div className="team-row__lbl">
              <Avatar
                label={e.initials} size="s" shape="superellipse"
                style={{ '--avatar-surface': 'var(--bg-brand-2)', '--avatar-color': 'var(--primitive-brand)' } as React.CSSProperties}
              />
              <span className="ts-500-xs">{e.name.split(' ')[0]}</span>
            </div>
            <Track segs={today} setTip={setTip} />
            <div className="team-row__sum ts-400-xs">
              {todayH ? fmtH(todayH) : '—'} · ср. {avg ? fmtH(avg) : '—'}/д
            </div>
          </div>
        ))}
      </div>
      <TypeLegend />
      {tip && <div className="tl-tip" style={{ left: tip.x + 12, top: tip.y + 12 }}>{tip.text}</div>}
    </div>
  );
};

/* ===== IP и география ===== */
const GeoBody: React.FC<{ emp: Employee }> = ({ emp }) => {
  const logins = loginsOf(emp).slice(0, 20);
  const cities = [...new Set(logins.map((l) => l.city))];
  const hasDeviation = logins.some((l) => l.geoOk === false);
  return (
    <div className="geo-body">
      <div className="geo-head">
        <div>
          <div className="ts-600-m">География входов</div>
          <div className="emp-table-sub ts-400-xs">{cities.length} {cities.length === 1 ? 'город' : 'города'} · последние {logins.length} входов</div>
        </div>
        <span className={'risk-pill ts-500-xs ' + (hasDeviation ? 'risk-pill--alert' : 'risk-pill--ok')}>
          {hasDeviation ? 'Есть отклонения' : 'Обычная география'}
        </span>
      </div>
      <table className="geo-table">
        <thead>
          <tr className="ts-400-xs">
            <th>Дата и время</th>
            <th>IP-адрес</th>
            <th>Город</th>
            <th>Устройство</th>
            <th>Оценка</th>
          </tr>
        </thead>
        <tbody>
          {logins.map((l) => (
            <tr key={l.id} className={l.geoOk === false || l.susp ? 'deviation' : ''}>
              <td className="ts-500-s">{dmy(l.date)}, {hm(l.date)}</td>
              <td className="ts-400-s mono">{l.ip}</td>
              <td className="ts-400-s">{l.city}</td>
              <td className="ts-400-s">{l.device}</td>
              <td>
                {l.geoOk === false
                  ? <span className="risk-pill risk-pill--alert ts-500-xs">Новый регион</span>
                  : l.susp
                    ? <span className="risk-pill risk-pill--alert ts-500-xs">Нерабочее время</span>
                    : <span className="risk-pill risk-pill--ok ts-500-xs">Без отклонений</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ===== Уведомления (колокольчик) ===== */
const NotifBell: React.FC<{
  checked: Set<string>;
  onGoTo: (empId: string) => void;
  onCheckAll: (ids: string[]) => void;
}> = ({ checked, onGoTo, onCheckAll }) => {
  const [open, setOpen] = useState(false);
  const [chEmail, setChEmail] = useState(true);
  const [chPush, setChPush] = useState(true);
  const [chDigest, setChDigest] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const items = useMemo(() => {
    const list: { emp: Employee; a: Action }[] = [];
    EMPLOYEES.forEach((emp) => {
      emp.actions.forEach((a) => {
        if (a.susp && !checked.has(a.id)) list.push({ emp, a });
      });
    });
    return list.sort((x, y) => y.a.t - x.a.t);
  }, [checked]);

  return (
    <div className="dropdown-wrap" ref={ref}>
      <button className={'bell-btn' + (open ? ' open' : '')} onClick={() => setOpen((o) => !o)} aria-label="Уведомления">
        <Icon icon={<Bell />} size="s" />
        {items.length > 0 && <span className="bell-badge ts-500-xs">{items.length}</span>}
      </button>
      {open && (
        <div className="menu bell-menu">
          <div className="bell-menu__head">
            <span className="ts-600-s">Уведомления</span>
            {items.length > 0 && (
              <button className="link-btn ts-400-xs" onClick={() => onCheckAll(items.map((i) => i.a.id))}>
                Отметить все проверенными
              </button>
            )}
          </div>
          {items.length === 0 ? (
            <div className="bell-empty ts-400-s">Непросмотренных подозрительных событий нет</div>
          ) : (
            <div className="bell-list">
              {items.map(({ emp, a }) => (
                <div key={a.id} className="bell-item" onClick={() => { onGoTo(emp.id); setOpen(false); }}>
                  <Avatar
                    label={emp.initials} size="s" shape="superellipse"
                    style={{ '--avatar-surface': 'var(--bg-warning-1)', '--avatar-color': '#8a6d12' } as React.CSSProperties}
                  />
                  <div className="bell-item__body">
                    <div className="ts-500-xs">{emp.name.split(' ').slice(0, 2).join(' ')} · {a.label}</div>
                    <div className="bell-item__reason ts-400-xs">{a.susp}</div>
                  </div>
                  <span className="bell-item__time ts-400-xs">{dmy(a.date)}, {hm(a.date)}</span>
                </div>
              ))}
            </div>
          )}
          <div className="bell-settings">
            <div className="bell-settings__title ts-400-xs">Как уведомлять о подозрительных событиях</div>
            <label className="bell-opt ts-400-s">
              <Checkbox isChecked={chEmail} onChange={() => setChEmail((v) => !v)} /> Email сразу при событии
            </label>
            <label className="bell-opt ts-400-s">
              <Checkbox isChecked={chPush} onChange={() => setChPush((v) => !v)} /> Push в мобильном приложении
            </label>
            <label className="bell-opt ts-400-s">
              <Checkbox isChecked={chDigest} onChange={() => setChDigest((v) => !v)} /> Еженедельный дайджест активности
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

/* ===== App ===== */
const PERIODS: [string, string][] = [['today', 'Сегодня'], ['yesterday', 'Вчера'], ['week', 'Неделя'], ['month', 'Месяц']];

const App: React.FC = () => {
  const [empId, setEmpId] = useState('petrova');
  const [period, setPeriod] = useState('week');
  const [customFrom, setCustomFrom] = useState(ymd(dayOffset(6)));
  const [customTo, setCustomTo] = useState(ymd(dayOffset(0)));
  const [types, setTypes] = useState<ActionType[]>([]);
  const [onlySusp, setOnlySusp] = useState(false);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<'feed' | 'timeline' | 'geo'>('feed');
  const [tlRange, setTlRange] = useState<'week' | 'month'>('week');
  const [tlScope, setTlScope] = useState<'one' | 'team'>('one');

  const emp = EMPLOYEES.find((e) => e.id === empId)!;
  const toggleCheck = (id: string) => setChecked((prev) => {
    const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s;
  });

  const range = useMemo<[Date, Date]>(() => {
    if (period === 'today') return [dayOffset(0), NOW];
    if (period === 'yesterday') return [dayOffset(1), dayOffset(0)];
    if (period === 'week') return [dayOffset(6), NOW];
    if (period === 'month') return [dayOffset(29), NOW];
    return [new Date(customFrom + 'T00:00:00'), new Date(customTo + 'T23:59:59')];
  }, [period, customFrom, customTo]);

  const periodLabel = PERIODS.find(([v]) => v === period)?.[1] || `${dmy(range[0])} — ${dmy(range[1])}`;

  const filtered = useMemo(() => {
    const [from, to] = range;
    return emp.actions
      .filter((a) => a.date >= from && a.date <= to)
      .filter((a) => !types.length || types.includes(a.type))
      .filter((a) => !onlySusp || !!a.susp)
      .sort((a, b) => b.t - a.t);
  }, [emp, range, types, onlySusp]);

  const suspStats = useMemo(() => {
    const [from, to] = range;
    let total = 0, unviewed = 0;
    emp.actions.forEach((a) => {
      if (a.date >= from && a.date <= to && a.susp) {
        total++;
        if (!checked.has(a.id)) unviewed++;
      }
    });
    return { total, unviewed };
  }, [emp, range, checked]);

  const groups = useMemo(() => {
    const m = new Map<string, { date: Date; items: Action[] }>();
    filtered.forEach((a) => {
      const k = ymd(a.date);
      if (!m.has(k)) m.set(k, { date: a.date, items: [] });
      m.get(k)!.items.push(a);
    });
    return [...m.values()];
  }, [filtered]);

  const goToFromBell = (id: string) => {
    setEmpId(id);
    setTab('feed');
    setOnlySusp(true);
    setPeriod('month');
  };

  return (
    <div className="app-shell">
      <MainPageNavigationBar
        activeNavItem="services"
        customer="ИП Иванов И.А."
        hasTin={false}
        hasSelect={false}
        hasSubscription={false}
        hasLive={false}
        avatarInitials="ИИ"
      />
      <div className="layout">
        <Sidebar />
        <main className="main">
          <div className="page-head">
            <NavigationBar
              isAdaptive={false}
              className="mon-nav"
              title="Мониторинг действий сотрудников"
              hasDescription={false}
              hasBackButton={false}
              hasActionButton={false}
              hasRootLink={false}
            />
            <NotifBell
              checked={checked}
              onGoTo={goToFromBell}
              onCheckAll={(ids) => setChecked((prev) => new Set([...prev, ...ids]))}
            />
          </div>

          <EmployeeTable
            range={range}
            periodLabel={periodLabel}
            empId={empId}
            checked={checked}
            onSelect={(id) => { setEmpId(id); setOnlySusp(false); }}
          />

          <EmployeePanel emp={emp} range={range} periodLabel={periodLabel} checked={checked} />

          <Widget
            className="mon-widget"
            contentClassName="mon-content"
            hasChevron={false}
            hasDescription
            description={<span className="widget-emp ts-400-xs">Сотрудник: <b>{emp.name.split(' ').slice(0, 2).join(' ')}</b> · {emp.role}</span>}
            hasRightAccessory={tab === 'timeline'}
            rightAccessory={
              tab === 'timeline' ? (
                <div className="controls__group">
                  <Chip variant="tab" isSelected={tlScope === 'one'} onClick={() => setTlScope('one')}>Сотрудник</Chip>
                  <Chip variant="tab" isSelected={tlScope === 'team'} onClick={() => setTlScope('team')}>Вся команда</Chip>
                  <span className="controls__sep" />
                  <Chip variant="tab" isSelected={tlRange === 'week'} onClick={() => setTlRange('week')}>Неделя</Chip>
                  <Chip variant="tab" isSelected={tlRange === 'month'} onClick={() => setTlRange('month')}>Месяц</Chip>
                </div>
              ) : undefined
            }
            title={
              <div className="tabsrow">
                <Chip variant="tab" isSelected={tab === 'feed'} onClick={() => setTab('feed')}>Лента действий</Chip>
                <Chip variant="tab" isSelected={tab === 'timeline'} onClick={() => setTab('timeline')}>Рабочее время</Chip>
                <Chip variant="tab" isSelected={tab === 'geo'} onClick={() => setTab('geo')}>IP и география</Chip>
              </div>
            }
          >
            {tab === 'feed' ? (
              <>
                <div className="controls">
                  <button
                    className={'susp-flag' + (onlySusp ? ' selected' : '') + (suspStats.unviewed ? ' alert' : '')}
                    onClick={() => setOnlySusp((s) => !s)}
                  >
                    <Icon icon={<WarningTriangle />} size="xs" />
                    <span className="ts-500-s">Подозрительные</span>
                    {suspStats.total > 0 && (
                      <span className={'flag-badge ts-500-xs' + (suspStats.unviewed ? ' flag-badge--alert' : '')}>
                        {suspStats.unviewed || suspStats.total}
                      </span>
                    )}
                  </button>
                  <span className="controls__sep" />
                  <div className="controls__group">
                    {PERIODS.map(([v, l]) => (
                      <Chip key={v} variant="tab" isSelected={period === v} onClick={() => setPeriod(v)}>{l}</Chip>
                    ))}
                  </div>
                  <div className="controls__group">
                    <Icon icon={<Calendar />} size="s" color="var(--primitive-neutral-4)" />
                    <input className="date-input" type="date" value={customFrom} onChange={(e) => { setCustomFrom(e.target.value); setPeriod('custom'); }} />
                    <span style={{ color: 'var(--primitive-neutral-4)' }}>—</span>
                    <input className="date-input" type="date" value={customTo} onChange={(e) => { setCustomTo(e.target.value); setPeriod('custom'); }} />
                  </div>
                  <div className="controls__spacer" />
                  <TypeFilter selected={types} onChange={setTypes} />
                </div>

                {groups.length === 0 ? (
                  <div className="empty ts-400-m">За выбранный период действий не найдено</div>
                ) : (
                  groups.map((g, i) => (
                    <div key={i}>
                      <div className="day-head ts-500-s">{dayHead(g.date)}</div>
                      {g.items.map((a) => (
                        <ActionRow
                          key={a.id}
                          a={a}
                          isChecked={checked.has(a.id)}
                          onToggleCheck={toggleCheck}
                        />
                      ))}
                    </div>
                  ))
                )}
              </>
            ) : tab === 'timeline' ? (
              tlScope === 'one'
                ? <TimelineBody emp={emp} range={tlRange} />
                : <TeamBoard range={tlRange} />
            ) : (
              <GeoBody emp={emp} />
            )}
          </Widget>
        </main>
      </div>
    </div>
  );
};

export default App;

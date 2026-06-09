import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  MainPageNavigationBar,
  Avatar,
  Cell,
  Chip,
  Checkbox,
  Tag,
} from '@tds';
import {
  Key, Eye, Card, Gear, DocumentList, DocumentListAcsArrowDownOutgoing,
  WarningTriangle, ChartBar, Person, PersonAcsCheckmark, Speedometer,
  Integration, Puzzle, Calendar, Filters, Cross,
} from '@tds/icons';
import {
  EMPLOYEES, TYPE_LABEL, TYPE_ORDER, NOW, WD,
  dayOffset, ymd, dmy, hm, hmFloat, dayHead, buildSegments,
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

/* ===== Employee card ===== */
const EmployeeCard: React.FC<{ emp: Employee; active: boolean; onClick: () => void }> = ({ emp, active, onClick }) => (
  <button className={'emp-card' + (active ? ' active' : '')} onClick={onClick}>
    <div className="emp-card__top">
      <Avatar
        label={emp.initials} size="l" shape="superellipse"
        style={{ '--avatar-surface': 'var(--bg-brand-2)', '--avatar-color': 'var(--primitive-brand)' } as React.CSSProperties}
      />
      <div style={{ minWidth: 0 }}>
        <div className="emp-card__name ts-600-s">{emp.name.split(' ').slice(0, 2).join(' ')}</div>
        <div className="emp-card__role ts-400-xs">{emp.role}</div>
      </div>
    </div>
    <div className="emp-card__status ts-400-xs">
      <span className={'dot ' + (emp.online ? 'dot--on' : 'dot--off')} />
      {emp.online ? 'Онлайн' : 'Офлайн'}
    </div>
    <Tag size="s" variant={emp.sign ? 'filled' : 'outlined'}>
      {emp.sign ? 'С правом подписи' : 'Без права подписи'}
    </Tag>
    {emp.online ? (
      <div className="emp-card__now ts-400-xs">
        <Icon icon={TYPE_ICON[emp.current!.type]} size="xs" color="var(--primitive-brand)" />
        <span>Сейчас: {emp.current!.label}</span>
      </div>
    ) : (
      <div className="emp-card__now emp-card__now--off ts-400-xs">
        Последний визит: {dmy(emp.lastVisit!)}, {hm(emp.lastVisit!)}
      </div>
    )}
  </button>
);

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
const ActionRow: React.FC<{ a: Action; marked: boolean; onToggle: (id: string) => void }> = ({ a, marked, onToggle }) => {
  const isSusp = !!a.susp || marked;
  const reason = a.susp || (marked ? 'Помечено вручную как подозрительное' : null);
  return (
    <div className={'act-row' + (isSusp ? ' susp' : '')}>
      <Cell
        hasLeftAccessory
        hasRightAccessory
        leftAccessory={
          <Avatar
            size="m" shape="superellipse" icon={<Icon icon={TYPE_ICON[a.type]} size="s" />}
            style={{
              '--avatar-surface': isSusp ? 'var(--bg-warning-2)' : 'var(--bg-neutral-2)',
              '--avatar-color': isSusp ? '#8a6d12' : 'var(--primitive-secondary)',
            } as React.CSSProperties}
          />
        }
        title={<span className="ts-500-s">{a.label}</span>}
        description={
          <>
            <span className="ts-400-xs">{a.detail}</span>
            {reason && (
              <span className="act-reason ts-400-xs">
                <Icon icon={<WarningTriangle />} size="2xs" color="#c79a14" />
                {reason}
              </span>
            )}
          </>
        }
        rightAccessory={
          <div className="act-right">
            <span className={`tag-tint tag-tint--${a.type} ts-500-xs`}>{TYPE_LABEL[a.type]}</span>
            <span className="act-time ts-400-s">{hm(a.date)}</span>
          </div>
        }
      />
      <div className="mark-btn">
        <Chip variant="action" leftAccessory="icon" leftIcon={marked ? <Cross /> : <WarningTriangle />} onClick={() => onToggle(a.id)}>
          {marked ? 'Снять пометку' : 'Пометить'}
        </Chip>
      </div>
    </div>
  );
};

/* ===== Timeline ===== */
const Timeline: React.FC<{ emp: Employee; marks: Set<string> }> = ({ emp, marks }) => {
  const [range, setRange] = useState<'week' | 'month'>('week');
  const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(null);
  const daysBack = range === 'week' ? 7 : 30;
  const rows = useMemo(() => buildSegments(emp.actions, daysBack, marks), [emp, daysBack, marks]);

  const active = rows.filter((r) => r.segs.length);
  const dur = active.map((r) => ({ date: r.date, d: r.segs.reduce((s, x) => s + (x.end - x.start), 0) }));
  const avg = dur.length ? dur.reduce((s, x) => s + x.d, 0) / dur.length : 0;
  const best = dur.slice().sort((a, b) => b.d - a.d)[0];
  const fmt = (h: number) => `${Math.floor(h)}ч ${Math.round((h % 1) * 60)}мин`;
  const HOURS = [0, 3, 6, 9, 12, 15, 18, 21, 24];

  return (
    <div className="card">
      <div className="tl-head">
        <span className="ts-600-m">История рабочего времени</span>
        <div className="controls__group">
          <Chip variant="tab" isSelected={range === 'week'} onClick={() => setRange('week')}>Неделя</Chip>
          <Chip variant="tab" isSelected={range === 'month'} onClick={() => setRange('month')}>Месяц</Chip>
        </div>
      </div>

      <div className="tl-stats">
        <div className="stat"><div className="stat__lbl ts-400-xs">Среднее время в ИБ за день</div><div className="stat__val ts-600-xl">{fmt(avg)}</div></div>
        <div className="stat"><div className="stat__lbl ts-400-xs">Самый активный день</div><div className="stat__val ts-600-l">{best ? `${WD[best.date.getDay()]}, ${('0' + best.date.getDate()).slice(-2)}.${('0' + (best.date.getMonth() + 1)).slice(-2)} — ${fmt(best.d)}` : '—'}</div></div>
        <div className="stat"><div className="stat__lbl ts-400-xs">Обычные часы работы</div><div className="stat__val ts-600-xl">9:00–18:00</div></div>
      </div>

      <div className="tl-grid">
        <div className="tl-axis">{HOURS.slice(0, -1).map((h) => <span key={h}>{('0' + h).slice(-2)}:00</span>)}</div>
        <div className={range === 'month' ? 'tl-rows-scroll' : ''}>
          {rows.map((r, i) => (
            <div className="tl-row" key={i}>
              <div className="tl-row__lbl ts-400-xs"><b>{('0' + r.date.getDate()).slice(-2)}.{('0' + (r.date.getMonth() + 1)).slice(-2)}</b> {WD[r.date.getDay()]}</div>
              <div className="tl-track">
                {HOURS.map((h) => <i key={h} style={{ left: (h / 24 * 100) + '%' }} />)}
                {r.segs.map((s, j) => (
                  <div
                    key={j}
                    className={'tl-seg' + (s.susp ? ' tl-seg--susp' : '')}
                    style={{ left: (s.start / 24 * 100) + '%', width: ((s.end - s.start) / 24 * 100) + '%' }}
                    onMouseEnter={(e) => setTip({ x: e.clientX, y: e.clientY, text: `${hmFloat(s.start)}–${hmFloat(s.end)}, ${s.cnt} действ.${s.susp ? `, ${s.susp} подозрит.` : ''}` })}
                    onMouseMove={(e) => setTip({ x: e.clientX, y: e.clientY, text: `${hmFloat(s.start)}–${hmFloat(s.end)}, ${s.cnt} действ.${s.susp ? `, ${s.susp} подозрит.` : ''}` })}
                    onMouseLeave={() => setTip(null)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="tl-legend ts-400-xs">
          <span><i style={{ background: 'var(--primitive-brand)' }} /> Активность в ИБ</span>
          <span><i style={{ background: 'var(--primitive-warning)' }} /> Период с подозрительными действиями</span>
        </div>
      </div>

      {tip && <div className="tl-tip" style={{ left: tip.x + 12, top: tip.y + 12 }}>{tip.text}</div>}
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
  const [marks, setMarks] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<'feed' | 'timeline'>('feed');

  const emp = EMPLOYEES.find((e) => e.id === empId)!;
  const toggleMark = (id: string) => setMarks((prev) => {
    const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s;
  });

  const range = useMemo<[Date, Date]>(() => {
    if (period === 'today') return [dayOffset(0), NOW];
    if (period === 'yesterday') return [dayOffset(1), dayOffset(0)];
    if (period === 'week') return [dayOffset(6), NOW];
    if (period === 'month') return [dayOffset(29), NOW];
    return [new Date(customFrom + 'T00:00:00'), new Date(customTo + 'T23:59:59')];
  }, [period, customFrom, customTo]);

  const isSusp = (a: Action) => !!a.susp || marks.has(a.id);

  const filtered = useMemo(() => {
    const [from, to] = range;
    return emp.actions
      .filter((a) => a.date >= from && a.date <= to)
      .filter((a) => !types.length || types.includes(a.type))
      .filter((a) => !onlySusp || isSusp(a))
      .sort((a, b) => b.t - a.t);
  }, [emp, range, types, onlySusp, marks]);

  const suspCount = useMemo(() => {
    const [from, to] = range;
    return emp.actions.filter((a) => a.date >= from && a.date <= to && isSusp(a)).length;
  }, [emp, range, marks]);

  const groups = useMemo(() => {
    const m = new Map<string, { date: Date; items: Action[] }>();
    filtered.forEach((a) => {
      const k = ymd(a.date);
      if (!m.has(k)) m.set(k, { date: a.date, items: [] });
      m.get(k)!.items.push(a);
    });
    return [...m.values()];
  }, [filtered]);

  return (
    <>
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
          <h1 className="page-title ts-600-2xl">Мониторинг действий сотрудников</h1>
          <p className="page-sub ts-400-s">Отслеживайте активность распорядителей в интернет-банке: действия, время работы и подозрительные события.</p>

          <div className="emp-grid">
            {EMPLOYEES.map((e) => (
              <EmployeeCard key={e.id} emp={e} active={e.id === empId} onClick={() => { setEmpId(e.id); setOnlySusp(false); }} />
            ))}
          </div>

          <div className="tabsrow">
            <Chip variant="tab" isSelected={tab === 'feed'} onClick={() => setTab('feed')}>Лента действий</Chip>
            <Chip variant="tab" isSelected={tab === 'timeline'} onClick={() => setTab('timeline')}>Рабочее время</Chip>
          </div>

          {tab === 'feed' ? (
            <div className="card">
              <div className="controls">
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
                <TypeFilter selected={types} onChange={setTypes} />
                <div className="controls__spacer" />
                <Chip
                  variant="action"
                  isSelected={onlySusp}
                  leftAccessory="icon"
                  leftIcon={<WarningTriangle />}
                  badge={suspCount}
                  onClick={() => setOnlySusp((s) => !s)}
                >
                  Подозрительные
                </Chip>
              </div>

              {groups.length === 0 ? (
                <div className="empty ts-400-m">За выбранный период действий не найдено</div>
              ) : (
                groups.map((g, i) => (
                  <div key={i}>
                    <div className="day-head ts-500-s">{dayHead(g.date)}</div>
                    {g.items.map((a) => (
                      <ActionRow key={a.id} a={a} marked={marks.has(a.id)} onToggle={toggleMark} />
                    ))}
                  </div>
                ))
              )}
            </div>
          ) : (
            <Timeline emp={emp} marks={marks} />
          )}
        </main>
      </div>
    </>
  );
};

export default App;

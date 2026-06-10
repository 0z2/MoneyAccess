import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  MainPageNavigationBar,
  NavigationBar,
  Avatar,
  Cell,
  Chip,
  Checkbox,
  Tag,
} from '@tds';
import {
  Key, Eye, Card, Gear, DocumentList, DocumentListAcsArrowDownOutgoing,
  WarningTriangle, Person, Speedometer,
  Integration, Puzzle, Calendar, Bell, CheckmarkCircle, Cross, CoinsRuble, ArrowLeft, Laptop,
} from '@tds/icons';
import {
  EMPLOYEES, TYPE_LABEL, NOW, WD,
  dayOffset, ymd, dmy, hm, hmFloat, dayHead, buildSegments, loginsOf, summarize,
  timeByType, plural, rub,
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

// Пастельная палитра занятий (по макету) — пай-чарт, таймлайн, легенды
const TYPE_COLOR: Record<ActionType, string> = {
  view: '#E2917E',
  auth: '#EE8E98',
  payment: '#8FACE0',
  documents: '#95C5A0',
  export: '#C9A7E2',
  settings: '#9AA6B5',
};
const fmtH = (h: number) => `${Math.floor(h)}ч ${Math.round((h % 1) * 60)}мин`;
const shortName = (e: Employee) => e.name.split(' ').slice(0, 2).join(' ');

/* ===== Sidebar (список) ===== */
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

/* ===== Левая колонка деталки ===== */
const DetailRail: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <aside className="sidebar detail-rail">
    <button className="back-btn" onClick={onBack} aria-label="Назад">
      <Icon icon={<ArrowLeft />} size="s" />
    </button>
    <div className="detail-rail__crumb ts-400-xs">Доступы ›</div>
    <div className="detail-rail__title ts-600-l">Мониторинг действий</div>
  </aside>
);

/* ===== Правая колонка действий ===== */
const ActionRail: React.FC = () => (
  <aside className="action-rail">
    <button className="rail-btn"><Icon icon={<Person />} size="s" /><span className="ts-500-s">Изменить роль и срок</span></button>
    <button className="rail-btn"><Icon icon={<CoinsRuble />} size="s" /><span className="ts-500-s">Настроить счета</span></button>
    <button className="rail-btn"><Icon icon={<DocumentListAcsArrowDownOutgoing />} size="s" /><span className="ts-500-s">Скачать доверенность</span></button>
    <button className="rail-btn rail-btn--danger"><Icon icon={<Cross />} size="s" /><span className="ts-500-s">Отозвать доступ</span></button>
  </aside>
);

/* ===== Employee table ===== */
const EmployeeTable: React.FC<{
  range: [Date, Date];
  checked: Set<string>;
  onOpen: (id: string) => void;
}> = ({ range, checked, onOpen }) => {
  const [from, to] = range;
  const rows = EMPLOYEES.map((e) => ({ e, s: summarize(e, from, to, checked) }));

  return (
    <div className="card emp-table-card">
      <div className="emp-table-head">
        <div>
          <div className="ts-600-m">Сотрудники</div>
          <div className="emp-table-sub ts-400-xs">За последнюю неделю · нажмите на сотрудника, чтобы открыть детали</div>
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
            <tr key={e.id} onClick={() => onOpen(e.id)}>
              <td>
                <div className="emp-cell">
                  <Avatar
                    label={e.initials} size="m" shape="superellipse"
                    style={{ '--avatar-surface': 'var(--bg-brand-2)', '--avatar-color': 'var(--primitive-brand)' } as React.CSSProperties}
                  />
                  <div>
                    <div className="ts-500-s">{shortName(e)}</div>
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

/* ===== Большой пай-чарт с легендой ===== */
interface Slice { label: string; value: string; share: number; color: string }
const BigDonut: React.FC<{ slices: Slice[] }> = ({ slices }) => {
  const SIZE = 230, CX = SIZE / 2, RO = 97, RI = 43, RL = (RO + RI) / 2;
  const pt = (r: number, a: number) => `${CX + r * Math.cos(a)} ${CX + r * Math.sin(a)}`;
  let acc = -Math.PI / 2;
  const labels: { x: number; y: number; text: string }[] = [];
  const wedges = slices.map((s) => {
    const a0 = acc;
    const a1 = acc + s.share * 2 * Math.PI;
    acc = a1;
    const mid = (a0 + a1) / 2;
    if (s.share >= 0.07) {
      labels.push({
        x: CX + RL * Math.cos(mid),
        y: CX + RL * Math.sin(mid) + 4,
        text: `${Math.round(s.share * 100)}%`,
      });
    }
    // полный круг — секторный path вырождается, рисуем кольцо
    if (s.share >= 0.999) {
      return (
        <g key={s.label}>
          <circle cx={CX} cy={CX} r={(RO + RI) / 2} fill="none" stroke={s.color} strokeWidth={RO - RI} />
        </g>
      );
    }
    const large = s.share > 0.5 ? 1 : 0;
    const d = [
      `M ${pt(RO, a0)}`,
      `A ${RO} ${RO} 0 ${large} 1 ${pt(RO, a1)}`,
      `L ${pt(RI, a1)}`,
      `A ${RI} ${RI} 0 ${large} 0 ${pt(RI, a0)}`,
      'Z',
    ].join(' ');
    return <path key={s.label} d={d} fill={s.color} />;
  });
  return (
    <div className="pie-wrap">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {wedges}
        {labels.map((l, i) => (
          <text key={i} x={l.x} y={l.y} textAnchor="middle" className="pie-label">{l.text}</text>
        ))}
      </svg>
      <div className="pie-legend">
        {slices.map((s) => (
          <div key={s.label} className="pie-legend__row">
            <i style={{ background: s.color }} />
            <div>
              <div className="ts-500-s">{s.label}</div>
              <div className="pie-legend__val ts-400-xs">{s.value}</div>
            </div>
          </div>
        ))}
      </div>
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
              '--avatar-surface': declined ? 'var(--bg-error-1, #fdecec)' : isSusp ? 'var(--bg-warning-2)' : TYPE_COLOR[a.type] + '33',
              '--avatar-color': declined ? 'var(--primitive-error, #d43d3d)' : isSusp ? '#8a6d12' : TYPE_COLOR[a.type],
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

const TimelineGrid: React.FC<{ emp: Employee; range: [Date, Date] }> = ({ emp, range }) => {
  const [tip, setTip] = useState<Tip>(null);
  const rows = useMemo(
    () => buildSegments(emp.actions, 30).filter((r) => r.date >= range[0] && r.date <= range[1]),
    [emp, range],
  );

  const active = rows.filter((r) => r.segs.length);
  const dur = active.map((r) => ({ date: r.date, d: r.segs.reduce((s, x) => s + (x.end - x.start), 0) }));
  const avg = dur.length ? dur.reduce((s, x) => s + x.d, 0) / dur.length : 0;
  const best = dur.slice().sort((a, b) => b.d - a.d)[0];

  return (
    <div className="card content-card">
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
      </div>
      {tip && <div className="tl-tip" style={{ left: tip.x + 12, top: tip.y + 12 }}>{tip.text}</div>}
    </div>
  );
};

/* ===== Общий борд команды (главный экран): только сегодня ===== */
const TeamCard: React.FC = () => {
  const [tip, setTip] = useState<Tip>(null);
  const data = useMemo(() => EMPLOYEES.map((e) => {
    const today = buildSegments(e.actions, 1)[0].segs;
    const todayH = today.reduce((s, x) => s + (x.end - x.start), 0);
    return { e, today, todayH };
  }), []);

  return (
    <div className="card content-card team-card">
      <div className="geo-head">
        <div>
          <div className="ts-600-m">Рабочее время команды</div>
          <div className="emp-table-sub ts-400-xs">Сегодня, {dmy(NOW)} · по часам</div>
        </div>
      </div>
      <div className="tl-grid">
        <HourAxis labelWidth={180} />
        <div>
          {data.map(({ e, today, todayH }) => (
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
                {todayH ? fmtH(todayH) : 'не заходил(а)'}
              </div>
            </div>
          ))}
        </div>
        <div className="tl-legend ts-400-xs">
          {(Object.keys(TYPE_COLOR) as ActionType[]).map((t) => (
            <span key={t}><i style={{ background: TYPE_COLOR[t] }} /> {TYPE_LABEL[t]}</span>
          ))}
          <span><i style={{ background: 'var(--primitive-warning)' }} /> Подозрительное</span>
        </div>
      </div>
      {tip && <div className="tl-tip" style={{ left: tip.x + 12, top: tip.y + 12 }}>{tip.text}</div>}
    </div>
  );
};

/* ===== Устройства сотрудника ===== */
const DevicesCard: React.FC<{ emp: Employee }> = ({ emp }) => {
  const devices = useMemo(() => {
    const m = new Map<string, { device: string; cnt: number; cities: Set<string>; last: Action; alert: boolean }>();
    loginsOf(emp).forEach((l) => {
      const d = m.get(l.device!);
      if (d) {
        d.cnt++;
        d.cities.add(l.city!);
        if (l.t > d.last.t) d.last = l;
        if (l.geoOk === false) d.alert = true;
      } else {
        m.set(l.device!, { device: l.device!, cnt: 1, cities: new Set([l.city!]), last: l, alert: l.geoOk === false });
      }
    });
    return [...m.values()].sort((a, b) => b.last.t - a.last.t);
  }, [emp]);

  return (
    <div className="card content-card">
      <div className="geo-head">
        <div className="ts-600-m">{devices.length} {plural(devices.length, 'устройство', 'устройства', 'устройств')}</div>
      </div>
      {devices.map((d) => (
        <div key={d.device} className={'device-row' + (d.alert ? ' deviation' : '')}>
          <Avatar
            size="m" shape="superellipse" icon={<Icon icon={<Laptop />} size="s" />}
            style={{
              '--avatar-surface': d.alert ? 'var(--bg-warning-1)' : 'var(--bg-neutral-2)',
              '--avatar-color': d.alert ? '#8a6d12' : 'var(--primitive-secondary)',
            } as React.CSSProperties}
          />
          <div className="device-row__body">
            <div className="ts-500-s">{d.device}</div>
            <div className="device-row__sub ts-400-xs">
              {[...d.cities].join(', ')} · {d.cnt} {plural(d.cnt, 'вход', 'входа', 'входов')}
              {d.alert && <span className="device-row__flag"> · вход из нового региона</span>}
            </div>
          </div>
          <div className="device-row__last ts-400-xs">
            Последний вход<br />
            <span className="ts-500-s">{dmy(d.last.date)}, {hm(d.last.date)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ===== IP и география (таблица входов) ===== */
const GeoTable: React.FC<{ emp: Employee; range: [Date, Date] }> = ({ emp, range }) => {
  const logins = loginsOf(emp).filter((l) => l.date >= range[0] && l.date <= range[1]);
  return (
    <div className="card content-card">
      <div className="geo-head">
        <div className="ts-600-m">{logins.length} {plural(logins.length, 'вход', 'входа', 'входов')}</div>
      </div>
      {logins.length === 0 ? (
        <div className="empty ts-400-m">За выбранный период входов не найдено</div>
      ) : (
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
      )}
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
                    <div className="ts-500-xs">{shortName(emp)} · {a.label}</div>
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
const PERIODS: [string, string][] = [['yesterday', 'Вчера'], ['today', 'Сегодня'], ['week', 'Неделя'], ['month', 'Месяц']];
type TabId = 'timeline' | 'feed' | 'geo';
const TABS: [TabId, string][] = [['timeline', 'Рабочее время'], ['feed', 'Действия'], ['geo', 'IP и география']];

const App: React.FC = () => {
  const [screen, setScreen] = useState<'list' | 'detail'>('list');
  const [empId, setEmpId] = useState('petrova');
  const [tab, setTab] = useState<TabId>('timeline');
  const [period, setPeriod] = useState('today');
  const [customFrom, setCustomFrom] = useState(ymd(dayOffset(6)));
  const [customTo, setCustomTo] = useState(ymd(dayOffset(0)));
  const [onlySusp, setOnlySusp] = useState(false);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const emp = EMPLOYEES.find((e) => e.id === empId)!;
  const toggleCheck = (id: string) => setChecked((prev) => {
    const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s;
  });

  const range = useMemo<[Date, Date]>(() => {
    if (period === 'today') return [dayOffset(0), NOW];
    if (period === 'yesterday') return [dayOffset(1), new Date(dayOffset(0).getTime() - 1)];
    if (period === 'week') return [dayOffset(6), NOW];
    if (period === 'month') return [dayOffset(29), NOW];
    return [new Date(customFrom + 'T00:00:00'), new Date(customTo + 'T23:59:59')];
  }, [period, customFrom, customTo]);

  const weekRange = useMemo<[Date, Date]>(() => [dayOffset(6), NOW], []);

  const openEmployee = (id: string) => {
    setEmpId(id);
    setScreen('detail');
    setTab('timeline');
    setPeriod('today');
    setOnlySusp(false);
  };

  const goToFromBell = (id: string) => {
    setEmpId(id);
    setScreen('detail');
    setTab('feed');
    setOnlySusp(true);
    setPeriod('month');
  };

  /* пай-чарт — только на «Рабочем времени» */
  const slices = useMemo<Slice[]>(() => {
    const [from, to] = range;
    if (tab !== 'timeline') return [];
    return timeByType(emp, from, to).map((s) => ({
      label: TYPE_LABEL[s.type], value: fmtH(s.hours), share: s.share, color: TYPE_COLOR[s.type],
    }));
  }, [emp, tab, range]);

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

  const filtered = useMemo(() => {
    const [from, to] = range;
    return emp.actions
      .filter((a) => a.date >= from && a.date <= to)
      .filter((a) => !onlySusp || !!a.susp)
      .sort((a, b) => b.t - a.t);
  }, [emp, range, onlySusp]);

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
        {screen === 'list' ? (
          <>
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
              <EmployeeTable range={weekRange} checked={checked} onOpen={openEmployee} />
              <TeamCard />
            </main>
          </>
        ) : (
          <>
            <DetailRail onBack={() => setScreen('list')} />
            <main className="main detail-main">
              <h1 className="detail-name">{shortName(emp)} {emp.name.split(' ')[2] || ''}</h1>
              <div className="detail-role ts-400-s">{emp.role} {emp.sign ? 'с правом подписи' : 'без права подписи'}</div>

              <div className="text-tabs">
                {TABS.map(([id, label]) => (
                  <button key={id} className={'text-tab' + (tab === id ? ' active' : '')} onClick={() => setTab(id)}>
                    {label}
                  </button>
                ))}
              </div>

              <div className={'card content-card filter-card' + (tab !== 'timeline' ? ' filter-card--bare' : '')}>
                <div className="controls detail-controls">
                  {tab === 'feed' && (
                    <>
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
                    </>
                  )}
                  {PERIODS.map(([v, l]) => (
                    <Chip key={v} variant="tab" isSelected={period === v} onClick={() => setPeriod(v)}>{l}</Chip>
                  ))}
                  <Chip variant="tab" isSelected={period === 'custom'} onClick={() => setPeriod('custom')}>Указать вручную</Chip>
                  {period === 'custom' && (
                    <div className="controls__group">
                      <Icon icon={<Calendar />} size="s" color="var(--primitive-neutral-4)" />
                      <input className="date-input" type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} />
                      <span style={{ color: 'var(--primitive-neutral-4)' }}>—</span>
                      <input className="date-input" type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} />
                    </div>
                  )}
                </div>
                {tab === 'timeline' && (
                  slices.length === 0
                    ? <div className="empty ts-400-m">Нет данных за выбранный период</div>
                    : <BigDonut slices={slices} />
                )}
              </div>

              {tab === 'feed' && (
                <div className="card content-card">
                  <div className="feed-head ts-600-m">
                    {filtered.length} {plural(filtered.length, 'действие', 'действия', 'действий')}
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
                </div>
              )}
              {tab === 'timeline' && <TimelineGrid emp={emp} range={range} />}
              {tab === 'geo' && (
                <>
                  <DevicesCard emp={emp} />
                  <GeoTable emp={emp} range={range} />
                </>
              )}
            </main>
            <ActionRail />
          </>
        )}
      </div>
    </div>
  );
};

export default App;

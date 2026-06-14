import { useRef, useState, useCallback, useEffect } from 'react';
import { THEATER_META, CATEGORY_META, PHASES, WAR_START, WAR_END } from '../data/constants.js';
import EventDot from './EventDot.jsx';

const WAR_DAYS = Math.round((WAR_END - WAR_START) / 86400000);
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const PHASE_COLORS = ['#b3a050','#c0392b','#4a90d9','#27ae8f','#7d9e5a','#d4a017'];

function dateToDay(dateStr) {
  return Math.round((new Date(dateStr) - WAR_START) / 86400000);
}

export default function Timeline({
  events, allEvents, zoom, setZoom, selectedEvent, onSelectEvent, dateRange, onJumpToPhase,
}) {
  const scrollRef = useRef(null);
  const [tooltip, setTooltip] = useState(null); // { event, x, y }
  const [collapsed, setCollapsed] = useState({});

  const pxPerDay = zoom * 3;
  const totalWidth = WAR_DAYS * pxPerDay + 260; // 130px left header margin + right padding

  const dayToX = useCallback((day) => 130 + day * pxPerDay, [pxPerDay]);

  // Jump to selected event
  useEffect(() => {
    if (selectedEvent && scrollRef.current) {
      const day = dateToDay(selectedEvent.date);
      const x = dayToX(day);
      const containerW = scrollRef.current.clientWidth;
      scrollRef.current.scrollLeft = Math.max(0, x - containerW / 2);
    }
  }, [selectedEvent, dayToX]);

  // Group events by theater
  const theaters = Object.keys(THEATER_META);
  const byTheater = {};
  theaters.forEach(t => { byTheater[t] = []; });
  events.forEach(e => {
    if (byTheater[e.theater]) byTheater[e.theater].push(e);
  });

  const toggleLane = (t) => setCollapsed(prev => ({ ...prev, [t]: !prev[t] }));

  // Build axis ticks
  const yearTicks = [];
  const monthTicks = [];
  for (let y = 1939; y <= 1945; y++) {
    const d = new Date(y, 0, 1);
    if (d < WAR_START) continue;
    const day = Math.round((d - WAR_START) / 86400000);
    yearTicks.push({ day, year: y });
    for (let m = 0; m < 12; m++) {
      const md = new Date(y, m, 1);
      const mday = Math.round((md - WAR_START) / 86400000);
      if (mday < 0 || mday > WAR_DAYS) continue;
      monthTicks.push({ day: mday, label: MONTHS[m], isJan: m === 0 });
    }
  }

  // Date range overlay: dim events outside range? We'll just show filtered ones.
  const [startDay, endDay] = dateRange;
  const rangeX1 = dayToX(startDay);
  const rangeX2 = dayToX(endDay);

  return (
    <>
      {/* Controls bar */}
      <div className="timeline-controls">
        <span className="zoom-label">Zoom</span>
        <button className="zoom-btn" onClick={() => setZoom(z => Math.max(1, z - 1))} disabled={zoom <= 1}>−</button>
        <span className="zoom-level">{zoom}×</span>
        <button className="zoom-btn" onClick={() => setZoom(z => Math.min(8, z + 1))} disabled={zoom >= 8}>+</button>

        <div className="controls-sep" />

        <div className="phase-legend">
          {PHASES.map((p, i) => (
            <button key={p.id} className="phase-chip" onClick={() => onJumpToPhase(p)}>
              <span className="phase-chip-dot" style={{ background: PHASE_COLORS[i], opacity: 0.7 }} />
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable canvas */}
      <div className="timeline-scroll" ref={scrollRef}>
        <div className="timeline-canvas" style={{ width: totalWidth }}>

          {/* Axis */}
          <div className="timeline-axis" style={{ width: totalWidth }}>
            <div className="axis-years">
              {yearTicks.map(({ day, year }) => (
                <div key={year}>
                  <div className="axis-year-tick" style={{ left: dayToX(day) }} />
                  <div className="axis-year-label" style={{ left: dayToX(day) }}>{year}</div>
                </div>
              ))}
            </div>
            <div className="axis-months">
              {monthTicks.filter(t => !t.isJan).map(({ day, label }) => (
                <div key={`${label}-${day}`}>
                  <div className="axis-month-tick" style={{ left: dayToX(day) }} />
                  {pxPerDay > 1.5 && (
                    <div className="axis-month-label" style={{ left: dayToX(day) }}>{label}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Phase bands */}
          <div className="phase-bands">
            {PHASES.map((p, i) => {
              const x1 = dayToX(Math.max(0, dateToDay(p.start)));
              const x2 = dayToX(Math.min(WAR_DAYS, dateToDay(p.end)));
              return (
                <div
                  key={p.id}
                  className="phase-band"
                  style={{ left: x1, width: x2 - x1, background: p.color }}
                >
                  <div className="phase-band-label" style={{ color: PHASE_COLORS[i] }}>{p.label}</div>
                </div>
              );
            })}
          </div>

          {/* Theater lanes */}
          <div className="lanes-container">
            {theaters.map(theaterKey => {
              const meta = THEATER_META[theaterKey];
              const laneEvents = byTheater[theaterKey];
              const isCollapsed = collapsed[theaterKey];

              return (
                <div key={theaterKey} className="theater-lane">
                  <div className="lane-header" onClick={() => toggleLane(theaterKey)}>
                    <div className="lane-color-bar" style={{ background: meta.color }} />
                    <span className="lane-name">{meta.shortLabel}</span>
                    <span className="lane-collapse-icon">{isCollapsed ? '▸' : '▾'}</span>
                  </div>

                  <div className={`lane-body ${isCollapsed ? 'collapsed' : ''}`}>
                    {/* Grid lines */}
                    {yearTicks.map(({ day, year }) => (
                      <div key={year} className="grid-line year" style={{ left: dayToX(day) - 130 }} />
                    ))}

                    {laneEvents.length === 0 && !isCollapsed && (
                      <div style={{
                        position: 'absolute', inset: 0, display: 'flex',
                        alignItems: 'center', paddingLeft: 16,
                        fontSize: 10, color: 'var(--text-faint)', fontStyle: 'italic',
                      }}>
                        No events match filters
                      </div>
                    )}

                    {laneEvents.map(ev => (
                      <EventDot
                        key={ev.id}
                        event={ev}
                        x={dayToX(dateToDay(ev.date)) - 130}
                        endX={ev.endDate ? dayToX(dateToDay(ev.endDate)) - 130 : null}
                        isSelected={selectedEvent?.id === ev.id}
                        onClick={() => onSelectEvent(ev)}
                        onMouseEnter={(e) => setTooltip({ event: ev, x: e.clientX, y: e.clientY })}
                        onMouseMove={(e) => setTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : t)}
                        onMouseLeave={() => setTooltip(null)}
                        theaterColor={meta.color}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {events.length === 0 && (
            <div className="no-events-msg">
              <span>No events match your filters</span>
              <small>Try adjusting the filters or date range</small>
            </div>
          )}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && <Tooltip event={tooltip.event} x={tooltip.x} y={tooltip.y} />}
    </>
  );
}

function Tooltip({ event, x, y }) {
  const meta = THEATER_META[event.theater];
  const catMeta = CATEGORY_META[event.category];
  const startDate = new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  const endDate   = event.endDate
    ? new Date(event.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const tipW = 260;
  const tipH = 120;
  const left = x + 14 + tipW > vw ? x - tipW - 14 : x + 14;
  const top  = y + 14 + tipH > vh ? y - tipH - 14 : y + 14;

  return (
    <div className="event-tooltip" style={{ left, top }}>
      <div className="tooltip-date">
        {startDate}{endDate ? ` – ${endDate}` : ''}
      </div>
      <div className="tooltip-title">{event.title}</div>
      <div className="tooltip-meta">
        <span className="tooltip-tag" style={{ color: meta.color, borderColor: meta.color + '44' }}>{meta.shortLabel}</span>
        <span className="tooltip-tag">{catMeta.icon} {event.category}</span>
        <span className="tooltip-tag">{event.scale}</span>
      </div>
      <div className="tooltip-sig">
        {[1,2,3,4,5].map(n => (
          <span key={n} className={`sig-star ${n <= event.significance ? 'filled' : ''}`}>★</span>
        ))}
      </div>
    </div>
  );
}

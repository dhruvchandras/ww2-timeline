import { useState, useMemo, useCallback } from 'react';
import { events } from './data/events.js';
import { THEATER_META, CATEGORY_META, SCALE_META, WAR_START, WAR_END } from './data/constants.js';
import FilterPanel from './components/FilterPanel.jsx';
import Timeline from './components/Timeline.jsx';
import DetailPanel from './components/DetailPanel.jsx';

const ALL_THEATERS = Object.keys(THEATER_META);
const ALL_CATEGORIES = Object.keys(CATEGORY_META);
const ALL_SCALES = Object.keys(SCALE_META);
const ALL_PERSPECTIVES = ['allied', 'axis', 'neutral'];
const WAR_DAYS = Math.round((WAR_END - WAR_START) / 86400000);

export default function App() {
  const [theaters, setTheaters] = useState(new Set(ALL_THEATERS));
  const [categories, setCategories] = useState(new Set(ALL_CATEGORIES));
  const [scales, setScales] = useState(new Set(ALL_SCALES));
  const [perspectives, setPerspectives] = useState(new Set(ALL_PERSPECTIVES));
  const [dateRange, setDateRange] = useState([0, WAR_DAYS]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [zoom, setZoom] = useState(2);

  const filteredEvents = useMemo(() => {
    const [startDay, endDay] = dateRange;
    return events.filter(e => {
      if (!theaters.has(e.theater)) return false;
      if (!categories.has(e.category)) return false;
      if (!scales.has(e.scale)) return false;
      if (!e.perspectives.some(p => perspectives.has(p))) return false;
      const eStart = Math.round((new Date(e.date) - WAR_START) / 86400000);
      const eEnd = e.endDate
        ? Math.round((new Date(e.endDate) - WAR_START) / 86400000)
        : eStart;
      if (eStart > endDay || eEnd < startDay) return false;
      return true;
    });
  }, [theaters, categories, scales, perspectives, dateRange]);

  const toggleSet = useCallback((setter, key) => {
    setter(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setTheaters(new Set(ALL_THEATERS));
    setCategories(new Set(ALL_CATEGORIES));
    setScales(new Set(ALL_SCALES));
    setPerspectives(new Set(ALL_PERSPECTIVES));
    setDateRange([0, WAR_DAYS]);
  }, []);

  const handleNavigate = useCallback((id) => {
    const ev = events.find(e => e.id === id);
    if (ev) setSelectedEvent(ev);
  }, []);

  const jumpToPhase = useCallback((phase) => {
    const ps = new Date(phase.start);
    const pe = new Date(phase.end);
    const startDay = Math.max(0, Math.round((ps - WAR_START) / 86400000));
    const endDay   = Math.min(WAR_DAYS, Math.round((pe - WAR_START) / 86400000));
    setDateRange([startDay, endDay]);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>World War II Timeline</h1>
        <span className="subtitle">1939 – 1945 · {filteredEvents.length} events shown</span>
        <div className="spacer" />
      </header>

      <div className="app-body">
        <FilterPanel
          theaters={theaters} onToggleTheater={k => toggleSet(setTheaters, k)}
          categories={categories} onToggleCategory={k => toggleSet(setCategories, k)}
          scales={scales} onToggleScale={k => toggleSet(setScales, k)}
          perspectives={perspectives} onTogglePerspective={k => toggleSet(setPerspectives, k)}
          dateRange={dateRange} onDateRange={setDateRange}
          warDays={WAR_DAYS}
          onReset={reset}
          eventCount={filteredEvents.length}
        />

        <div className="timeline-area">
          <Timeline
            events={filteredEvents}
            allEvents={events}
            zoom={zoom}
            setZoom={setZoom}
            selectedEvent={selectedEvent}
            onSelectEvent={setSelectedEvent}
            dateRange={dateRange}
            onJumpToPhase={jumpToPhase}
          />
        </div>

        {selectedEvent && (
          <DetailPanel
            event={selectedEvent}
            allEvents={events}
            onClose={() => setSelectedEvent(null)}
            onNavigate={handleNavigate}
          />
        )}
      </div>
    </div>
  );
}

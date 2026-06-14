import { useState } from 'react';
import { THEATER_META, CATEGORY_META, SCALE_META, WAR_START } from '../data/constants.js';

const PERSPECTIVES = [
  { key: 'allied',  label: 'Allied Powers' },
  { key: 'axis',    label: 'Axis Powers'   },
  { key: 'neutral', label: 'Neutral / Both'},
];

const ALL_THEATERS    = Object.keys(THEATER_META);
const ALL_CATEGORIES  = Object.keys(CATEGORY_META);
const ALL_SCALES      = Object.keys(SCALE_META);
const ALL_PERSPECTIVES = PERSPECTIVES.map(p => p.key);

function dayToDate(day) {
  const d = new Date(WAR_START.getTime() + day * 86400000);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function SelectAllNone({ allKeys, activeSet, onSetAll, onSetNone }) {
  const allOn  = allKeys.every(k => activeSet.has(k));
  const allOff = allKeys.every(k => !activeSet.has(k));
  return (
    <div className="select-all-none">
      <button
        className={`san-btn${allOn ? ' san-active' : ''}`}
        onClick={() => onSetAll(new Set(allKeys))}
      >all</button>
      <span className="san-sep">·</span>
      <button
        className={`san-btn${allOff ? ' san-active' : ''}`}
        onClick={() => onSetNone(new Set())}
      >none</button>
    </div>
  );
}

export default function FilterPanel({
  theaters,    onToggleTheater,    onSetTheaters,
  categories,  onToggleCategory,   onSetCategories,
  scales,      onToggleScale,      onSetScales,
  perspectives,onTogglePerspective,onSetPerspectives,
  dateRange, onDateRange,
  warDays,
  onReset,
  eventCount,
}) {
  const [collapsed, setCollapsed] = useState(false);

  const handleStart = (e) => {
    const v = parseInt(e.target.value);
    onDateRange([Math.min(v, dateRange[1] - 30), dateRange[1]]);
  };

  const handleEnd = (e) => {
    const v = parseInt(e.target.value);
    onDateRange([dateRange[0], Math.max(v, dateRange[0] + 30)]);
  };

  const fillLeft  = `${(dateRange[0] / warDays) * 100}%`;
  const fillRight = `${(1 - dateRange[1] / warDays) * 100}%`;

  if (collapsed) {
    return (
      <div className="filter-panel collapsed" onClick={() => setCollapsed(false)} style={{ cursor: 'pointer' }}>
        <div className="filter-panel-toggle" style={{ justifyContent: 'center', padding: '10px 0' }}>
          <span style={{ fontSize: 14 }}>›</span>
        </div>
      </div>
    );
  }

  return (
    <div className="filter-panel">
      <div className="filter-panel-toggle" onClick={() => setCollapsed(true)}>
        <span>Filters</span>
        <span style={{ fontSize: 12 }}>‹</span>
      </div>

      {/* Theaters */}
      <div className="filter-section">
        <div className="filter-section-header">
          <div className="filter-section-title">Theater</div>
          <SelectAllNone
            allKeys={ALL_THEATERS}
            activeSet={theaters}
            onSetAll={onSetTheaters}
            onSetNone={onSetTheaters}
          />
        </div>
        {Object.entries(THEATER_META).map(([key, meta]) => (
          <div
            key={key}
            className={`filter-toggle-row ${theaters.has(key) ? 'active' : ''}`}
            onClick={() => onToggleTheater(key)}
          >
            <span className="theater-dot" style={{ background: meta.color }} />
            <span className="toggle-label">{meta.label}</span>
            <span className="toggle-check">✓</span>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div className="filter-section">
        <div className="filter-section-header">
          <div className="filter-section-title">Category</div>
          <SelectAllNone
            allKeys={ALL_CATEGORIES}
            activeSet={categories}
            onSetAll={onSetCategories}
            onSetNone={onSetCategories}
          />
        </div>
        {Object.entries(CATEGORY_META).map(([key, meta]) => (
          <div
            key={key}
            className={`filter-toggle-row ${categories.has(key) ? 'active' : ''}`}
            onClick={() => onToggleCategory(key)}
          >
            <span style={{ fontSize: 12, width: 16, textAlign: 'center', flexShrink: 0 }}>{meta.icon}</span>
            <span className="toggle-label">{meta.label}</span>
            <span className="toggle-check">✓</span>
          </div>
        ))}
      </div>

      {/* Scale */}
      <div className="filter-section">
        <div className="filter-section-header">
          <div className="filter-section-title">Scale</div>
          <SelectAllNone
            allKeys={ALL_SCALES}
            activeSet={scales}
            onSetAll={onSetScales}
            onSetNone={onSetScales}
          />
        </div>
        <div className="scale-buttons">
          {Object.entries(SCALE_META).map(([key, meta]) => (
            <button
              key={key}
              className={`scale-btn ${scales.has(key) ? 'active' : ''}`}
              onClick={() => onToggleScale(key)}
            >
              {meta.label}
              <span className="scale-desc">{meta.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Perspective */}
      <div className="filter-section">
        <div className="filter-section-header">
          <div className="filter-section-title">Perspective</div>
          <SelectAllNone
            allKeys={ALL_PERSPECTIVES}
            activeSet={perspectives}
            onSetAll={onSetPerspectives}
            onSetNone={onSetPerspectives}
          />
        </div>
        {PERSPECTIVES.map(({ key, label }) => (
          <div
            key={key}
            className={`filter-toggle-row ${perspectives.has(key) ? 'active' : ''}`}
            onClick={() => onTogglePerspective(key)}
          >
            <span className="toggle-label">{label}</span>
            <span className="toggle-check">✓</span>
          </div>
        ))}
      </div>

      {/* Date range */}
      <div className="filter-section">
        <div className="filter-section-title">Date Range</div>
        <div className="date-range-labels">
          <span>{dayToDate(dateRange[0])}</span>
          <span>{dayToDate(dateRange[1])}</span>
        </div>
        <div className="dual-slider">
          <div className="slider-track-bg">
            <div className="slider-track-fill" style={{ left: fillLeft, right: fillRight }} />
          </div>
          <input type="range" min={0} max={warDays} value={dateRange[0]} onChange={handleStart} style={{ zIndex: dateRange[0] > warDays - 100 ? 5 : 3 }} />
          <input type="range" min={0} max={warDays} value={dateRange[1]} onChange={handleEnd} style={{ zIndex: 4 }} />
        </div>
        <button className="reset-btn" onClick={onReset}>Reset All Filters</button>
      </div>

      <div className="event-count">{eventCount} event{eventCount !== 1 ? 's' : ''} visible</div>
    </div>
  );
}

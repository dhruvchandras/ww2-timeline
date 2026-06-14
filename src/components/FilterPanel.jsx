import { useState } from 'react';
import { THEATER_META, CATEGORY_META, SCALE_META, WAR_START } from '../data/constants.js';

const PERSPECTIVES = [
  { key: 'allied',  label: 'Allied Powers' },
  { key: 'axis',    label: 'Axis Powers'   },
  { key: 'neutral', label: 'Neutral / Both'},
];

function dayToDate(day) {
  const d = new Date(WAR_START.getTime() + day * 86400000);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function FilterPanel({
  theaters, onToggleTheater,
  categories, onToggleCategory,
  scales, onToggleScale,
  perspectives, onTogglePerspective,
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
        <div className="filter-section-title">Theater</div>
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
        <div className="filter-section-title">Category</div>
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
        <div className="filter-section-title">Scale</div>
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
        <div className="filter-section-title">Perspective</div>
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
            <div
              className="slider-track-fill"
              style={{ left: fillLeft, right: fillRight }}
            />
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

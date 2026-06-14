import { THEATER_META, CATEGORY_META, SCALE_META } from '../data/constants.js';

function formatDate(dateStr, endDateStr) {
  const opts = { day: 'numeric', month: 'long', year: 'numeric' };
  const start = new Date(dateStr).toLocaleDateString('en-US', opts);
  if (!endDateStr) return start;
  const end = new Date(endDateStr).toLocaleDateString('en-US', opts);
  return `${start} – ${end}`;
}

function Stars({ n }) {
  return (
    <div className="sig-row">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`sig-star ${i <= n ? 'filled' : ''}`}>★</span>
      ))}
    </div>
  );
}

export default function DetailPanel({ event, allEvents, onClose, onNavigate }) {
  const theater = THEATER_META[event.theater];
  const category = CATEGORY_META[event.category];
  const scale = SCALE_META[event.scale];

  const relatedEvents = (event.relatedEventIds || [])
    .map(id => allEvents.find(e => e.id === id))
    .filter(Boolean);

  return (
    <div className="detail-panel">
      <div className="detail-header">
        <div className="detail-theater-bar" style={{ background: theater?.color }} />
        <div className="detail-header-top">
          <div style={{ flex: 1 }}>
            <div className="detail-date">{formatDate(event.date, event.endDate)}</div>
            <h2 className="detail-title">{event.title}</h2>
          </div>
          <button className="detail-close" onClick={onClose}>✕</button>
        </div>
        {event.location && (
          <div className="detail-location">📍 {event.location}</div>
        )}
        <div className="detail-tags">
          <span className="detail-tag" style={{ color: theater?.color, borderColor: (theater?.color ?? '#888') + '55' }}>
            {theater?.label}
          </span>
          <span className="detail-tag">{category?.icon} {event.category}</span>
          <span className="detail-tag scale">{scale?.label}</span>
          {event.perspectives.map(p => (
            <span key={p} className="detail-tag">{p}</span>
          ))}
        </div>
      </div>

      <div className="detail-body">
        {/* Significance */}
        <div>
          <div className="detail-section-label">Significance</div>
          <Stars n={event.significance} />
        </div>

        {/* Description */}
        <div>
          <div className="detail-section-label">Overview</div>
          <p className="detail-description">{event.description}</p>
        </div>

        {/* Outcome */}
        <div>
          <div className="detail-section-label">Outcome</div>
          <div className="detail-outcome">{event.outcome}</div>
        </div>

        {/* Key figures */}
        {event.keyFigures?.length > 0 && (
          <div>
            <div className="detail-section-label">Key Figures</div>
            <div className="detail-figures">
              {event.keyFigures.map(f => (
                <span key={f} className="figure-chip">{f}</span>
              ))}
            </div>
          </div>
        )}

        {/* Related events */}
        {relatedEvents.length > 0 && (
          <div>
            <div className="detail-section-label">Related Events</div>
            <div className="related-list">
              {relatedEvents.map(rel => {
                const relTheater = THEATER_META[rel.theater];
                return (
                  <button key={rel.id} className="related-item" onClick={() => onNavigate(rel.id)}>
                    <div className="related-dot" style={{ background: relTheater?.color }} />
                    <div className="related-text">
                      <div className="related-title">{rel.title}</div>
                      <div className="related-date">
                        {new Date(rel.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        {' · '}{relTheater?.shortLabel}
                      </div>
                    </div>
                    <span style={{ color: 'var(--text-faint)', fontSize: 12 }}>›</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

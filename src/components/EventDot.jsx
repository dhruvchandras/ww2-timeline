import { CATEGORY_META } from '../data/constants.js';

const SIG_SIZES = [8, 10, 12, 15, 19];
const DOT_TOP = 10;
const ROW_HEIGHT = 16;
const DOT_MAX_RADIUS = 10;
const LABEL_TOP_BASE = DOT_TOP + DOT_MAX_RADIUS + 5;

function shortTitle(title) {
  return title.length > 32 ? title.slice(0, 30).trimEnd() + '…' : title;
}

export default function EventDot({ event, x, endX, labelRow, isSelected, onClick, onMouseEnter, onMouseMove, onMouseLeave, theaterColor }) {
  const size = SIG_SIZES[event.significance - 1] ?? 12;
  const icon = CATEGORY_META[event.category]?.icon ?? '';
  const fill = theaterColor + 'bb';
  const border = theaterColor;
  const labelTop = LABEL_TOP_BASE + labelRow * ROW_HEIGHT;

  return (
    <>
      {endX !== null && endX > x && (
        <div
          className="event-duration-bar"
          style={{ left: x, width: endX - x, background: theaterColor }}
        />
      )}

      <div
        className={`event-pin${isSelected ? ' selected' : ''}`}
        style={{ left: x }}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {/* Dot — always at fixed top */}
        <div
          className="event-dot"
          style={{
            position: 'absolute',
            top: DOT_TOP,
            left: -(size / 2),
            width: size,
            height: size,
            background: fill,
            borderColor: border,
          }}
        >
          {size >= 14 && <span className="dot-icon">{icon}</span>}
        </div>

        {/* Thin connector line from dot to label when staggered */}
        {labelRow > 0 && (
          <div style={{
            position: 'absolute',
            left: 0,
            top: DOT_TOP + size / 2,
            width: 1,
            height: labelTop - (DOT_TOP + size / 2),
            background: theaterColor,
            opacity: 0.3,
          }} />
        )}

        {/* Label at computed row position */}
        <div
          className="event-label"
          style={{ position: 'absolute', top: labelTop, color: theaterColor }}
        >
          {shortTitle(event.title)}
        </div>
      </div>
    </>
  );
}

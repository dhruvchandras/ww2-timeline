import { CATEGORY_META } from '../data/constants.js';

const SIG_SIZES = [8, 10, 12, 15, 19]; // px diameter for significance 1–5
// Shorten very long titles for the inline label
function shortTitle(title) {
  return title.length > 32 ? title.slice(0, 30).trimEnd() + '…' : title;
}

export default function EventDot({ event, x, endX, isSelected, onClick, onMouseEnter, onMouseMove, onMouseLeave, theaterColor }) {
  const size = SIG_SIZES[event.significance - 1] ?? 12;
  const icon = CATEGORY_META[event.category]?.icon ?? '';
  const fill = theaterColor + 'bb';
  const border = theaterColor;

  return (
    <>
      {/* Duration bar for multi-day events */}
      {endX !== null && endX > x && (
        <div
          className="event-duration-bar"
          style={{ left: x, width: endX - x, background: theaterColor }}
        />
      )}

      {/* Wrapper positions the dot + label together */}
      <div
        className={`event-pin${isSelected ? ' selected' : ''}`}
        style={{ left: x }}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {/* Dot */}
        <div
          className="event-dot"
          style={{
            width: size,
            height: size,
            background: fill,
            borderColor: border,
            marginLeft: -(size / 2),
          }}
        >
          {size >= 14 && <span className="dot-icon">{icon}</span>}
        </div>

        {/* Always-visible label */}
        <div
          className="event-label"
          style={{ color: theaterColor }}
        >
          {shortTitle(event.title)}
        </div>
      </div>
    </>
  );
}

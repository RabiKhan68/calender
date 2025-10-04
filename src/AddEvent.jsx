import { useState } from "react";
import "./AddEvent.css";

function AddEvent({ setEvents }) {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [type, setType] = useState("Personal");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState(false);

  const handleAdd = () => {
    if (!title || !start || !end) {
      setError(true);
      return;
    }

    let startDate = new Date(start);
    let endDate = new Date(end);

    // Normalize times for all-day events
    if (allDay) {
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
    }

    setEvents((prev) => [
      ...prev,
      {
        title,
        allDay,
        start: startDate,
        end: endDate,
        type,
        desc,
      },
    ]);

    // Reset form
    setTitle("");
    setStart("");
    setEnd("");
    setAllDay(false);
    setType("Personal");
    setDesc("");
    setError(false);
  };

  return (
    <div className="add-event-container">
      <h2 className="form-title">Add New Event</h2>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Event Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError(false);
            }}
            className={`form-input ${error && !title ? "error" : ""}`}
            placeholder="Enter event title"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="form-input"
          >
            <option>Personal</option>
            <option>Work</option>
            <option>Holiday</option>
            <option>Religious</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Start Date</label>
          <input
            type="datetime-local"
            value={start}
            onChange={(e) => {
              setStart(e.target.value);
              setError(false);
            }}
            className={`form-input ${error && !start ? "error" : ""}`}
          />
        </div>

        <div className="form-group">
          <label className="form-label">End Date</label>
          <input
            type="datetime-local"
            value={end}
            onChange={(e) => {
              setEnd(e.target.value);
              setError(false);
            }}
            className={`form-input ${error && !end ? "error" : ""}`}
          />
        </div>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={allDay}
            onChange={(e) => setAllDay(e.target.checked)}
          />
          All-day Event
        </label>

        <div className="form-group" style={{ gridColumn: "span 2" }}>
          <label className="form-label">Description</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="form-input"
            placeholder="Optional description..."
          />
        </div>
      </div>

      {error && (
        <p className="error-text">⚠ Please fill in all required fields</p>
      )}

      <button onClick={handleAdd} className="submit-btn">
        Add Event
      </button>
    </div>
  );
}

export default AddEvent;

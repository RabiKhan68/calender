import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
} from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./App.css";
import AddEvent from "./AddEvent";

const locales = { "en-US": enUS };

// Correct localizer with parse wrapper
const localizer = dateFnsLocalizer({
  format: (date, formatStr, options) => format(date, formatStr, options),
  parse: (value, formatStr, options) => parse(value, formatStr, new Date(), options),
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 0 }), // Sunday start
  getDay,
  locales,
});

function App() {
  const [holidayEvents, setHolidayEvents] = useState([]);
  const [customEvents, setCustomEvents] = useState(() => {
    const saved = localStorage.getItem("customEvents");
    if(!saved) return [];
    return JSON.parse(saved).map(ev => ({
      ...ev,
      start: new Date(ev.start),
      end: new Date(ev.end),
    }));
  });

  const [country, setCountry] = useState(() => {
    return localStorage.getItem("country") || "US";
  });
  const [year, setYear] = useState(new Date().getFullYear());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light");

  // Save country to localStorage
  useEffect(() => {
    localStorage.setItem("country", country);
  }, [country]);

  // Save custom events
  useEffect(() => {
    localStorage.setItem("customEvents", JSON.stringify(customEvents));
  }, [customEvents]);

  // Detect theme
  useEffect(() => {
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(darkQuery.matches ? "dark" : "light");
    const listener = (e) => setTheme(e.matches ? "dark" : "light");
    darkQuery.addEventListener("change", listener);
    return () => darkQuery.removeEventListener("change", listener);
  }, []);

  // Fetch holidays
  useEffect(() => {
    async function fetchHolidays() {
      try {
        setLoading(true);
        const res = await fetch(
          `https://calendarific.com/api/v2/holidays?api_key=p5PcxQbyvgTvVwHUm4GpgHw9j7flrNp6&country=${country}&year=${year}`
        );

        if (!res.ok) throw new Error("API request failed");
        const json = await res.json();
        const holidays = json?.response?.holidays || [];

        const holidayEvents = holidays.map((h) => ({
          title: h.name,
          start: new Date(h.date.iso),
          end: new Date(h.date.iso),
          allDay: true,
          type: h.type?.[0] || "Holiday",
        }));

        setHolidayEvents(holidayEvents);
      } catch (err) {
        console.error("Error fetching holidays:", err);
        setHolidayEvents([]);
      } finally {
        setLoading(false);
      }
    }

    fetchHolidays();
  }, [country, year]);

  // Merge API + custom events
  const allEvents = [...holidayEvents, ...customEvents];

  return (
    <div className={`app-container ${theme}`}>
      <h1 className="title">Sein Calender</h1>

      {/* Controls */}
      <div className="controls">
        <label>
          Country:{" "}
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="dropdown"
          >
            <option value="US">United States</option>
            <option value="PK">Pakistan</option>
            <option value="IN">India</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
          </select>
        </label>

        <label>
          Year:{" "}
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="year-input"
          />
        </label>
      </div>

      {/* Calendar */}
      {loading ? (
        <p style={{ textAlign: "center" }}>Loading holidays...</p>
      ) : (
        <Calendar
          localizer={localizer}
          events={allEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 650, marginTop: "20px" }}
          views={["month", "week", "day", "agenda"]}
          defaultView="month"
          popup
          toolbar
          date={currentDate}
          onNavigate={(newDate) => setCurrentDate(newDate)}
          eventPropGetter={(event) => {
            let bgColor = "#007bff"; // default blue
            if (event.type === "National holiday") bgColor = "green";
            if (event.type === "Religious") bgColor = "purple";
            if (event.type === "Observance") bgColor = "orange";
            if (event.type === "Personal") bgColor = "#1e90ff";
            if (event.type === "Work") bgColor = "gray";
            return {
              style: {
                backgroundColor: bgColor,
                color: "white",
                borderRadius: "6px",
                padding: "2px",
              },
            };
          }}
          messages={{
            month: "Month",
            week: "Week",
            day: "Day",
            agenda: "Agenda",
            today: "Today",
            previous: "<",
            next: ">",
          }}
        />
      )}

      {/* Add Event Form */}
      <AddEvent setEvents={setCustomEvents} />
    </div>
  );
}

export default App;

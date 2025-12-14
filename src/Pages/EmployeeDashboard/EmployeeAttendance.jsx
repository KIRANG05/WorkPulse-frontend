import React, { useEffect, useState, useCallback } from "react";
import api from "../../Services/api";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "./EmployeeAttendence.module.css";

const localizer = momentLocalizer(moment);

export default function EmployeeAttendance() {
  const [events, setEvents] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [visibleDate, setVisibleDate] = useState(new Date());

  const year = visibleDate.getFullYear();
  const month = visibleDate.getMonth() + 1;

  // 🔹 Fetch attendance of logged-in user
  const fetchAttendance = useCallback(async () => {
    try {
      const res = await api.get(`/attendence/myAttendence`, {
        params: { year, month }
      });

      if (res.data?.isSuccess) {
        const formatted = res.data.data.map((a) => ({
          id: a.id,
          title: a.status,
          dateStr: a.date,
          loginTime: a.loginTime,
          logoutTime: a.logoutTime,
          start: moment(a.date, "DD-MM-YYYY").toDate(),
          end: moment(a.date, "DD-MM-YYYY").toDate(),
        }));
        setEvents(formatted);
        const today = moment().format("DD-MM-YYYY");
        setSelectedDetail(formatted.find((d) => d.dateStr === today) || null);
      } else {
        setEvents([]);
        setSelectedDetail(null);
      }
    } catch {
      setEvents([]);
      setSelectedDetail(null);
    }
  }, [year, month]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  // 🔹 Cell background color logic
  const dayPropGetter = (date) => {
    const dateStr = moment(date).format("DD-MM-YYYY");
    const match = events.find((e) => e.dateStr === dateStr);

    return {
      className: styles.hoverDayCell,
      style: match
        ? {
            backgroundColor: match.title === "P" ? "#c7f7c1" : "#ffbfbf",
            border: "1px solid #777",
          }
        : {},
    };
  };

  return (
    <div className={styles.attendance}>
      <h2 className={styles.heading}>My Attendance</h2>

      {/* Month & Year Dropdowns */}
      <div className={styles.filterBar}>
        {/* Month */}
        <select
          className={styles.smallSelect}
          value={month}
          onChange={(e) =>
            setVisibleDate(
              moment(visibleDate).month(Number(e.target.value) - 1).toDate()
            )
          }
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {moment().month(i).format("MMMM")}
            </option>
          ))}
        </select>

        {/* Year */}
        <select
          className={styles.smallSelect}
          value={year}
          onChange={(e) =>
            setVisibleDate(moment(visibleDate).year(Number(e.target.value)).toDate())
          }
        >
          {Array.from({ length: 6 }, (_, i) => year - 3 + i).map((yr) => (
            <option key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>
      </div>

      {/* Body Layout */}
      <div className={styles.body}>
        {/* Calendar */}
        <div className={styles.left}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={["month"]}
            selectable
            date={visibleDate}
            onNavigate={(d) => setVisibleDate(d)}
            onSelectEvent={(e) => setSelectedDetail(e)}
            onSelectSlot={(slot) => {
              const dateStr = moment(slot.start).format("DD-MM-YYYY");
              const match = events.find((e) => e.dateStr === dateStr);
              setSelectedDetail(match || null);
            }}
            dayPropGetter={dayPropGetter}
            eventPropGetter={() => ({ style: { display: "none" } })}
            components={{
              dateHeader: ({ label, date }) => {
                const dateStr = moment(date).format("DD-MM-YYYY");
                const match = events.find((e) => e.dateStr === dateStr);

                return (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "18px",
                      color: "#000",
                    }}
                  >
                    {match ? match.title : label}
                  </div>
                );
              },
            }}
            style={{ height: "78vh" }}
          />
        </div>

        {/* Right Side Details */}
        <div className={styles.right}>
          {selectedDetail ? (
            <>
              <h3>Day Summary</h3>
              <p><strong>Date:</strong> {selectedDetail.dateStr}</p>
              <p><strong>Status:</strong> {selectedDetail.title === "P" ? "Present" : "Absent"}</p>
              <p><strong>Login:</strong> {selectedDetail.loginTime || "--"}</p>
              <p><strong>Logout:</strong> {selectedDetail.logoutTime || "--"}</p>
            </>
          ) : (
            <p>No data</p>
          )}
        </div>
      </div>
    </div>
  );
}

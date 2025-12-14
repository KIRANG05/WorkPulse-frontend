import { useEffect, useState } from "react";
import api from "../../Services/api";  // axios instance
import { useNotifications } from "../../Context/NotificationContext";

function EmployeeNotification() {
  const { notifications, loadNotifications, markLocalRead } = useNotifications();
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const userId = localStorage.getItem("userId");

  // fetch paginated notifications
  useEffect(() => {
    loadNotifications(page, size, "EMPLOYEE"); // pass HR role or endpoint if needed
  }, [page]);

  const markAsRead = async (notificationId) => {
    markLocalRead(notificationId); // update UI
    try {
      await api.put(`/notification/read`, null, {
        params: { notificationId },
      });
    } catch (err) {
      console.error("Mark read failed", err);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "20px auto", padding: "0 20px" }}>
      <h2 style={{ marginBottom: 20, fontSize: 28, color: "#333" }}>🔔 My Notifications</h2>

      {notifications.length === 0 && (
        <p style={{ textAlign: "center", color: "#777", fontSize: 16 }}>
          No notifications found.
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => markAsRead(n.id)}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: 12,
              padding: "12px 16px",
              backgroundColor: n.read ? "#fafafa" : "#fff8e1",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <strong>{n.type}</strong>
              <small>{n.createdAt}</small>

            </div>
            <p style={{ margin: 0 }}>{n.message}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 10 }}>
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>⬅ Previous</button>
        <span>Page {page + 1} / {totalPages}</span>
        <button disabled={page === totalPages - 1} onClick={() => setPage(page + 1)}>Next ➡</button>
      </div>
    </div>
  );
}

export default EmployeeNotification;


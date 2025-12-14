import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

import SockJS from "sockjs-client";
import api from "../../Services/api";  // axios instance
import { useNotifications } from "../../Context/NotificationContext";

function NotificationPage() {
  const { notifications, loadNotifications, markLocalRead, pageInfo } = useNotifications();

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  // 🔹 Fetch paginated notifications from backend
//  const fetchNotifications = async () => {
//   try {
//     const role = localStorage.getItem("role");
//     const id = localStorage.getItem("userId");

//     const res = await api.get(`/notification/fetch-paged`, {
//       params: { id, role, page, size },
//     });

//     if (res.data.isSuccess) {
//       setNotifications(res.data.data.content);
//       setTotalPages(res.data.data.totalPages);
//     }
//   } catch (err) {
//     console.error("Error fetching notifications", err);
//   }
// };


//   useEffect(() => {
//     fetchNotifications();
//   }, [page]);

  // 🔹 WebSocket Subscription

// useEffect(() => {
//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");
//   const userId = localStorage.getItem("userId");

//   const socket = new SockJS(`http://localhost:8081/emp/notification/ws?token=${token}`);
//   const stompClient = new Client({
//     webSocketFactory: () => socket,
//     reconnectDelay: 5000,
//     onConnect: () => {
//       // Employee / user notifications
//       stompClient.subscribe(`/topic/user/${userId}`, (msg) => {
//        const notification = JSON.parse(msg.body);
// addNotification(notification); // do not wrap in array

//       });

//       // Admin notifications
//       if (role === "ADMIN") {
//         stompClient.subscribe(`/topic/admin/notification`, (msg) => {
//           const notification = JSON.parse(msg.body);
// addNotification(notification); // do not wrap in array

//         });
//       }
//     },
//   });

//   stompClient.activate();

//   return () => stompClient.deactivate();
// }, []);



// fetch paginated notifications
useEffect(() => {
  loadNotifications(page, 10);
}, [page]);

  // 🔹 Click to mark as read
  const markAsRead = async (notificationId) => {
  markLocalRead(notificationId); // Update UI immediately
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
      <h2 style={{ marginBottom: 20, fontSize: 28, color: "#333" }}>🔔 Notifications</h2>

      {notifications.length === 0 && (
        <p style={{ textAlign: "center", color: "#777", fontSize: 16 }}>
          No notifications found.
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {notifications.map((n, index) => (
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
              <small>
                {/* {new Date(n.createdAt).toLocaleString("en-US", { hour12: true })} */}
                <small>{n.createdAt}</small>

              </small>
            </div>
            <p style={{ margin: 0 }}>{n.message}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 10 }}>
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>
          ⬅ Previous
        </button>
        <span>
          Page {page + 1} / {totalPages}
        </span>
        <button disabled={page === totalPages - 1} onClick={() => setPage(page + 1)}>
          Next ➡
        </button>
      </div>
    </div>
  );
}

export default NotificationPage;

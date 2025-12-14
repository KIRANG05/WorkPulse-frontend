import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import api from "../../Services/api";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./EmployeeTodo.module.css";

function EmployeeTodo() {
  const [todos, setTodos] = useState([]);
  const [filterDate, setFilterDate] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  // Convert JS Date → dd-MM-yyyy
  const formatDate = (date) => {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
  };

  // Fetch Todos with filters
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterDate) params.date = formatDate(filterDate);
      if (searchText.trim()) params.search = searchText.trim();

      const res = await api.get("/todo/getAll", { params });

      if (res.data.isSuccess) {
        setTodos(res.data.data.todos);
      } else {
        setTodos([]);
      }

      // Clear inputs after fetch
      setFilterDate(null);
      setSearchText("");
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to fetch todos",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add / Edit Todo
  const openTodoForm = async (todo = null) => {
    const { value: formValues } = await Swal.fire({
      title: todo ? "Edit Todo" : "Add Todo",
      html: `
        <input id="swal-title" class="swal2-input" placeholder="Title" value="${todo ? todo.title : ""}">
        <textarea id="swal-desc" class="swal2-textarea" placeholder="Description">${todo ? todo.description : ""}</textarea>
      `,
      showCancelButton: true,
      preConfirm: () => {
        const title = document.getElementById("swal-title").value.trim();
        const description = document.getElementById("swal-desc").value.trim();

        if (!title) {
          Swal.showValidationMessage("* Title is required");
          return false;
        }

        return { title, description };
      },
    });

    if (formValues) {
      try {
        let res;
        if (todo) {
          res = await api.put(`/todo/update/${todo.id}`, formValues);
        } else {
          res = await api.post("/todo/add", formValues);
        }

        if (res.data.isSuccess) {
          Swal.fire("Success", res.data.message, "success");
          fetchTodos();
        } else {
          Swal.fire("Error", res.data.message || "Something went wrong", "error");
        }
      } catch (err) {
        Swal.fire(
          "Error",
          err.response?.data?.message || "Something went wrong",
          "error"
        );
      }
    }
  };

  // Delete Todo
  const deleteTodo = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await api.delete(`/todo/delete/${id}`);
          if (res.data.isSuccess) {
            Swal.fire("Success", res.data.message, "success");
            fetchTodos();
          } else {
            Swal.fire("Error", res.data.message || "Failed to delete todo", "error");
          }
        } catch (err) {
          Swal.fire(
            "Error",
            err.response?.data?.message || "Something went wrong!",
            "error"
          );
        }
      }
    });
  };

  return (
    <div className={styles.container}>
      <h2>Todo List</h2>

      {/* Top Bar */}
      <div className={styles.topBar}>
        <DatePicker
          selected={filterDate}
          onChange={(date) => setFilterDate(date)}
          placeholderText="Created Date"
          dateFormat="dd-MM-yyyy"
          className={styles.datePicker}
        />
        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className={styles.searchBox}
        />
        <button className={styles.addBtn} onClick={() => openTodoForm()}>
          + Add Todo
        </button>
        <button className={styles.filterBtn} onClick={fetchTodos}>
          Go
        </button>
      </div>

      {/* Todo Table */}
      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : todos.length > 0 ? (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {todos.map((todo) => (
                <tr key={todo.id}>
                  <td>{todo.title}</td>
                  <td>{todo.description}</td>
                  <td>{new Date(todo.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => openTodoForm(todo)}>✏️</button>
                    <button onClick={() => deleteTodo(todo.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.noDataCard}>No todos found</div>
      )}
    </div>
  );
}

export default EmployeeTodo;

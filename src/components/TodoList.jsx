import React, { useRef, useState, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TodoList = () => {
    const [data, setData] = useState(() => {
        const savedTasks = localStorage.getItem("tasks");
        return savedTasks ? JSON.parse(savedTasks) : [];
    });

    const txt = useRef();

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(data));
    }, [data]);

    // Check for expired tasks
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const updatedData = data.filter((task) => {
                // If the task has expired (current time is past expiration time)
                return new Date(task.expirationTimestamp).getTime() > now;
            });
            if (updatedData.length !== data.length) {
                setData(updatedData)
            }
        }, 60000);
        return () => clearInterval(interval);
    }, [data]);

    const Ajouter = () => {
        const message = txt.current.value.trim();
        if (message) {
            const expirationTimestamp = new Date();
            expirationTimestamp.setHours(expirationTimestamp.getHours() + 24); // Add 24 hours to the current time

            setData([...data, { text: message, completed: false, timestamp: new Date().toISOString(), expirationTimestamp: expirationTimestamp.toISOString() }]);
            txt.current.value = "";
        } else {
            alert("It is mandatory to fill in the field.");
        }
    };

    const Supprime = (index) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            const updatedData = data.filter((_, i) => i !== index);
            setData(updatedData);
            toast.success("Task deleted successfully!");
        }
    };

    const completedTask = (index) => {
        const updatedData = data.map((task, i) =>
            i === index ? { ...task, completed: !task.completed } : task
        );
        setData(updatedData);
    };

    return (
        <div className="card shadow-sm">
            <div className="card-header">
                <h2 className="h5 mb-0">My tasks</h2>
            </div>
            <div className="card-body">
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Add new task"
                        ref={txt}
                    />
                    <button className="btn btn-primary" onClick={Ajouter}>
                        Add
                    </button>
                </div>
                <ul className="list-group">
                    {data.length === 0 ? (
                        <li className="list-group-item text-center">No tasks available</li>
                    ) : (
                        data.map((task, index) => (
                            <li
                                key={index}
                                className={`list-group-item d-flex justify-content-between align-items-center task-item ${task.completed ? "completed" : ""}`}
                                onClick={() => completedTask(index)}
                            >
                                <span>
                                    {task.text}
                                    <br />
                                    <small>
                                        Expires:{" "}
                                        {new Date(task.expirationTimestamp).toLocaleString("en-US", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            day: "2-digit",
                                            month: "short",
                                        })}
                                    </small>
                                </span>
                                <RiDeleteBin6Line
                                    className="delete-icon"
                                    size={20}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        Supprime(index);
                                    }}
                                />
                            </li>
                        ))
                    )}
                </ul>
            </div>
            <ToastContainer />
        </div>
    );
};

export default TodoList;

import { useEffect, useState, useContext } from "react";
import { Container, Table, Button, Form } from "react-bootstrap";
import { Notyf } from "notyf";
import UserContext from "../context/UserContext";
import { Navigate } from "react-router-dom";

export default function Tickets() {
    const { user } = useContext(UserContext);
    const [tickets, setTickets] = useState([]);
    const notyf = new Notyf();

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/tickets`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setTickets(data);
        })
        .catch(err => {
            console.error(err);
            notyf.error("Failed to fetch tickets");
        });
    }, []);

    function handleStatusChange(id, status) {
        fetch(`${process.env.REACT_APP_API_URL}/tickets/${id}/status`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === "Ticket status updated successfully") {
                notyf.success("Status updated");
                // refresh tickets
                refreshTickets();
            } else {
                notyf.error(data.message || "Failed to update status");
            }
        })
        .catch(() => notyf.error("Server error while updating status"));
    }

    function handleDelete(id) {
        if (!window.confirm("Are you sure you want to delete this ticket?")) return;

        fetch(`${process.env.REACT_APP_API_URL}/tickets/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === "Ticket deleted successfully") {
                notyf.success("Ticket deleted");
                refreshTickets();
            } else {
                notyf.error("Delete failed");
            }
        })
        .catch(() => notyf.error("Server error while deleting ticket"));
    }

    function refreshTickets() {
        fetch(`${process.env.REACT_APP_API_URL}/tickets`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => setTickets(data))
        .catch(() => notyf.error("Failed to refresh ticket list"));
    }

    return (
        (user.id == null || user.id === undefined) ?
        <Navigate to="/login" />
        :
        <Container className="mt-5 pt-3">
            <h2 className="mb-4">All Tickets</h2>

            {tickets.length === 0 ? (
                <p>No tickets to display.</p>
            ) : (
                <Table bordered hover>
                    <thead className="table-dark">
                        <tr>
                            <th>Name</th>
                            <th>Feedback</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map(ticket => (
                            <tr key={ticket._id}>
                                <td>{ticket.firstName} {ticket.lastName}</td>
                                <td>{ticket.feedback}</td>
                                <td>
                                    <Form.Select
                                        value={ticket.status}
                                        onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                                    >
                                        <option>Pending</option>
                                        <option>In Progress</option>
                                        <option>Resolved</option>

                                    </Form.Select>
                                </td>
                                <td>{new Date(ticket.dateSubmitted).toLocaleString()}</td>
                                <td>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(ticket._id)}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
}

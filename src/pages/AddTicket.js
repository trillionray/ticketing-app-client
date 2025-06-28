import { useState, useEffect, useContext } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { Notyf } from "notyf";
import { Navigate } from "react-router-dom";
import UserContext from "../context/UserContext";

export default function CreateTicket() {
    const notyf = new Notyf();
    const { user } = useContext(UserContext);

    const [feedback, setFeedback] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const token = localStorage.getItem("token");

    function handleSubmit(e) {
        e.preventDefault();

        fetch(`${process.env.REACT_APP_API_URL}/tickets`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                firstName: user.firstName,
                lastName: user.lastName,
                feedback: feedback
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.ticket) {
                notyf.success("Ticket submitted successfully");
                setFeedback("");
                setSubmitted(true);
            } else {
                notyf.error("Failed to submit ticket");
            }
        })
        .catch(error => {
            console.error(error);
            notyf.error("Server error");
        });
    }

    useEffect(() => {
        setIsActive(feedback.trim() !== "");
    }, [feedback]);

    if (!user.id) {
        return <Navigate to="/login" />;
    }

    if (submitted) {
        return <Navigate to="/tickets" />;
    }

    return (
        <Container fluid className="d-flex justify-content-center align-items-center mt-5 pt-5">
            <Form onSubmit={handleSubmit} className="col-12 col-md-6">
                <h1 className="text-center">Submit a Ticket</h1>

                <Form.Group className="mb-3">
                    <Form.Label>Feedback</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="Enter your feedback"
                        required
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                    />
                </Form.Group>

                <Button variant={isActive ? "primary" : "secondary"} type="submit" disabled={!isActive}>
                    Submit
                </Button>
            </Form>
        </Container>
    );
}

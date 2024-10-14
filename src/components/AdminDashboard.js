import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [pendingRequests, setPendingRequests] = useState([]);

    useEffect(() => {
        const fetchPendingRequests = async () => {
            try {
                const response = await axios.get('https://hostel-db-server.vercel.app/api/leaving-forms/pending-requests');
                setPendingRequests(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchPendingRequests();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            const response = await axios.patch(`https://hostel-db-server.vercel.app/api/leaving-forms/update-status/${id}`, { status });
            alert(response.data.message);
            setPendingRequests(pendingRequests.filter(request => request._id !== id)); // Remove updated request
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <h2>Pending Leaving Requests</h2>
            {pendingRequests.length === 0 ? (
                <p>No pending requests</p>
            ) : (
                <ul>
                    {pendingRequests.map((request) => (
                        <li key={request._id}>
                            {request.studentName} wants to leave at {new Date(request.leavingTime).toLocaleString()}.
                            <button onClick={() => handleStatusUpdate(request._id, 'accepted')}>Accept</button>
                            <button onClick={() => handleStatusUpdate(request._id, 'rejected')}>Reject</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AdminDashboard;
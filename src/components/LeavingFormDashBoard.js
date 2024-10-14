import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LeavingFormDashBoard = () => {
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

    const handleUpdateStatus = async (id, status) => {
        try {
            await axios.patch(`https://hostel-db-server.vercel.app//api/leaving-forms/update-status/${id}`, { status });
            alert(`Request ${status} successfully`);
            // Refresh the list of pending requests
            setPendingRequests(pendingRequests.filter(request => request._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Pending Leaving Requests</h2>
            <ul>
                {pendingRequests.map(request => (
                    <li key={request._id}>
                        {request.studentName} - {request.reason}
                        <button onClick={() => handleUpdateStatus(request._id, 'accepted')}>Accept</button>
                        <button onClick={() => handleUpdateStatus(request._id, 'rejected')}>Reject</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LeavingFormDashBoard;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentInHostel = () => {
    const [absentees, setAbsentees] = useState([]);

    useEffect(() => {
        const fetchAbsentees = async () => {
            try {
                const response = await axios.get('https://hostel-db-server.vercel.app/api/admin/hostel-absentees');
                setAbsentees(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAbsentees();
    }, []);

    const handleReturnToHostel = async (studentId) => {
        try {
            await axios.patch(`https://hostel-db-server.vercel.app/api/admin/update-hostel-status/${studentId}`);
            alert('Student status updated to true (returned to hostel)');
            setAbsentees(absentees.filter(absentee => absentee._id !== studentId));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Hostel Absentees</h2>
            <ul>
                {absentees.map(student => (
                    <li key={student._id}>
                        {student.name} - {student.fatherMobile}
                        <button onClick={() => handleReturnToHostel(student._id)}>Mark as Returned</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StudentInHostel;
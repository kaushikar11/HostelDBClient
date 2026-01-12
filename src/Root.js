import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import SearchComponent from './SearchComponent';
import './Root.css';

const URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:3001/api/students';

const Root = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [studentList, setStudentList] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [fileUrls, setFileUrls] = useState({});

    useEffect(() => {
        // Fetch student list from the server
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const response = await Axios.get(`${URL}/read`);
                setStudentList(response.data);
                setSearchResults(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching student list:', error);
                setError('Error fetching student list. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    useEffect(() => {
        // Build image URLs from MongoDB GridFS for each student
        if (studentList.length === 0) return;
        
        const imageBaseUrl = process.env.REACT_APP_SERVER_URL?.replace('/api/students', '') || 'http://localhost:3001';
        const urls = {};
        
        studentList.forEach((student) => {
            if (student.rollNo) {
                urls[student.rollNo] = `${imageBaseUrl}/api/images/${student.rollNo}`;
            }
        });
        
        setFileUrls(urls);
    }, [studentList]);

    const handleStudentClick = (id) => {
        navigate(`/student/${id}`);
    };

    const handleSearch = (filteredResults) => {
        setSearchResults(filteredResults);
    };

    return (
        <div className="root-container">
            <div className="root-content">
                <div className="root-header">
                    <h1 className="root-title">Student Management Dashboard</h1>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="search-section">
                    <SearchComponent
                        data={studentList}
                        searchKey="name"
                        onSearch={handleSearch}
                    />
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading students...</p>
                    </div>
                ) : (
                    <div className="table-container">
                        {searchResults.length === 0 ? (
                            <div className="empty-state">
                                <p>No students found.</p>
                            </div>
                        ) : (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Photo</th>
                                        <th>Name</th>
                                        <th>Roll Number</th>
                                        <th>Department</th>
                                        <th>Year</th>
                                        <th>Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {searchResults.map((student) => (
                                        <tr key={student._id} onClick={() => handleStudentClick(student._id)}>
                                            <td>
                                                {fileUrls[student.rollNo] ? (
                                                    <img 
                                                        src={fileUrls[student.rollNo]} 
                                                        alt={student.name} 
                                                        className="student-photo"
                                                    />
                                                ) : (
                                                    <div className="no-photo">No Photo</div>
                                                )}
                                            </td>
                                            <td>{student.name || 'N/A'}</td>
                                            <td>{student.rollNo || 'N/A'}</td>
                                            <td>{student.classBranchSection || 'N/A'}</td>
                                            <td>{student.yearOfStudy || 'N/A'}</td>
                                            <td>{student.studentEmail || 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Root;

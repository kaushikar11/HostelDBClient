import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Axios from 'axios';
import SearchComponent from './SearchComponent';
import { storage } from "./firebase";
import { getDownloadURL, ref } from 'firebase/storage';
import './Root.css';

const URL = process.env.REACT_APP_SERVER_URL;

const Root = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [studentList, setStudentList] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [fileUrls, setFileUrls] = useState({});

    useEffect(() => {
        // Fetch image URLs from Firebase Storage for each student
        const fetchFileUrls = async () => {
            try {
                const urls = {};
                await Promise.all(
                    studentList.map(async (student) => {
                        const imageRef = ref(storage, `studentDetails/${student.rollNo}/passportsizephoto.jpg`);
                        try {
                            const url = await getDownloadURL(imageRef);
                            urls[student.rollNo] = url;
                        } catch (error) {
                            console.log(error);
                        }
                    })
                );
                setFileUrls(urls);
            } catch (error) {
                console.error('Error fetching file URLs:', error);
            }
        };

        if (studentList.length > 0) {
            fetchFileUrls();
        }
        // Fetch student list from the server
        Axios.get(`${URL}/read`)
            .then((response) => {
                setStudentList(response.data);
            })
            .catch((error) => {
                console.error('Error fetching student list:', error);
                setError('Error fetching student list. Please try again later.');
            });

        
    }, [studentList]); // Fetch URLs whenever studentList changes

    const handleStudentClick = (id) => {
        navigate(`/student/${id}`);
    };

    return (
        <div className="home-container">
            <Navbar />
            <div className="search-container">
                <SearchComponent
                    data={studentList}
                    searchKey="name"
                    setSearchResults={results => setSearchResults(results.filter(student => student.name.includes(searchTerm)))}
                />
            </div>
            {error && <div className="error-message">{error}</div>}
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Register Number</th>
                        <th>Image</th>
                    </tr>
                </thead>
                <tbody>
                    {searchResults.map((student) => (
                        <tr key={student._id} onClick={() => handleStudentClick(student._id)}>
                            <td>{student.name}</td>
                            <td>{student.rollNo}</td>
                            <td>
                                {console.log(fileUrls[student.rollNo])}
                                {fileUrls[student.rollNo] ? (
                                    <img src={fileUrls[student.rollNo]} alt={student.name} style={{ width: '100px', height: 'auto' }} />
                                ) : (
                                    <div>No Image</div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="button-container">
                <Link to="/add-student" className="btn">Add Student</Link>
            </div>
        </div>
    );
};

export default Root;

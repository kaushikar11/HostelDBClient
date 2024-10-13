import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { storage } from './firebase/firebase'; // Import Firebase storage
import { getDownloadURL, ref } from 'firebase/storage'; // Import required Firebase functions
import './StudentDetails.css';
import { generatePDF } from './functions/generatePDF';
import { useDispatch, useSelector } from 'react-redux';
import { startGeneratingPDF } from './pdfThunk/actions';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

console.log(SERVER_URL);

const StudentDetails = () => {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedStudent, setUpdatedStudent] = useState({});
    const [imageUrl] = useState(''); // State to hold the image URL
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [imageBlob, setImageBlob] = useState(null);
    const dispatch = useDispatch();
    const pdfUrl = useSelector((state) => state.pdf.pdfUrl);
    const progress = useSelector((state) => state.pdf.progress); 
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    const handleDownloadPDF = async () => {
        setLoading(true); // Show loading indicator
        setSuccessMessage(''); // Reset success message
        setErrorMessage(''); // Reset error message
        console.log('Download PDF button clicked.');
      
        try {
          const result = await dispatch(startGeneratingPDF({ imageBlob, student }));
      
          if (result && result.payload) {
            const { pdfUrl } = result.payload;
            setSuccessMessage('PDF has been generated successfully!');
          } else {
            setErrorMessage('Failed to generate PDF. Please try again.'); // Show error message
          }
        } catch (error) {
          console.error('Error generating PDF:', error);
          setErrorMessage('Failed to generate PDF. Please try again.'); // Show error message if something goes wrong
        } finally {
          setLoading(false); // Hide loading indicator
        }
      };
      

    
    
    useEffect(() => {
        return () => {
            if (pdfUrl) {
                try {
                    URL.revokeObjectURL(pdfUrl);
                } catch (e) {
                    console.error('Failed to revoke object URL:', e);
                }
            }
        };
    }, [pdfUrl]);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await Axios.get(`${SERVER_URL}/api/students/student/${id}`);
                setStudent(response.data);
                setUpdatedStudent(response.data);

                // Fetch image URL from Firebase Storage
                const imageRef = ref(storage, `studentDetails/${response.data.rollNo}/passportsizephoto.jpg`);
                const url = await getDownloadURL(imageRef);
                const imageResponse = await fetch(url);
                const blob = await imageResponse.blob();  // Get the Blob of the image
                console.log(blob);
                setImageBlob(blob);  // Store the Blob in state

            } catch (error) {
                console.error('Error fetching student details or image URL:', error);
            }
        };

        fetchStudent();
    }, [id]);

    useEffect(() => {
        if (imageBlob) {
            console.log("Image Blob after state update:", imageBlob);
        }
    }, [imageBlob]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedStudent(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleUpdate = async () => {
        try {
            await Axios.put(`${SERVER_URL}/api/students/update-student/${id}`, updatedStudent);
            setStudent(updatedStudent);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating student:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await Axios.delete(`${SERVER_URL}/api/students/delete-student/${id}`);
            navigate('/root');
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    

    return (
        <div className="student-details-container">
            {student ? (
                <div className="student-details">
                    <h1>Student Details</h1>
                    <div className="student-image-container">
                    {imageUrl && <img src={imageUrl} alt="Student" className="student-image" />} {/* Display student image */}
                    </div>
                    {isEditing ? (
                        <form className="student-form">
                            <label>
                                Name:
                                <input
                                    type="text"
                                    name="name"
                                    value={updatedStudent.name || ''}
                                    onChange={handleInputChange}
                                    placeholder="Name"
                                />
                            </label>
                            <label>
                                Roll Number:
                                <input
                                    type="text"
                                    name="rollNo"
                                    value={updatedStudent.rollNo || ''}
                                    onChange={handleInputChange}
                                    placeholder="Roll Number"
                                />
                            </label>
                            <label>
                                Caste:
                                <input
                                    type="text"
                                    name="caste"
                                    value={updatedStudent.caste || ''}
                                    onChange={handleInputChange}
                                    placeholder="Caste"
                                />
                            </label>
                            <label>
                                Community:
                                <input
                                    type="text"
                                    name="community"
                                    value={updatedStudent.community || ''}
                                    onChange={handleInputChange}
                                    placeholder="Community"
                                />
                            </label>
                            <label>
                                Class, Branch, Section:
                                <input
                                    type="text"
                                    name="classBranchSection"
                                    value={updatedStudent.classBranchSection || ''}
                                    onChange={handleInputChange}
                                    placeholder="Class, Branch, Section"
                                />
                            </label>
                            <label>
                                Year of Study:
                                <input
                                    type="text"
                                    name="yearOfStudy"
                                    value={updatedStudent.yearOfStudy || ''}
                                    onChange={handleInputChange}
                                    placeholder="Year of Study"
                                />
                            </label>
                            <label>
                                Father's Name:
                                <input
                                    type="text"
                                    name="fatherName"
                                    value={updatedStudent.fatherName || ''}
                                    onChange={handleInputChange}
                                    placeholder="Father's Name"
                                />
                            </label>
                            <label>
                                Father's Occupation:
                                <input
                                    type="text"
                                    name="fatherOccupation"
                                    value={updatedStudent.fatherOccupation || ''}
                                    onChange={handleInputChange}
                                    placeholder="Father's Occupation"
                                />
                            </label>
                            <label>
                                Father's Income:
                                <input
                                    type="text"
                                    name="fatherIncome"
                                    value={updatedStudent.fatherIncome || ''}
                                    onChange={handleInputChange}
                                    placeholder="Father's Income"
                                />
                            </label>
                            <label>
                                Father's Mobile:
                                <input
                                    type="text"
                                    name="fatherMobile"
                                    value={updatedStudent.fatherMobile || ''}
                                    onChange={handleInputChange}
                                    placeholder="Father's Mobile"
                                />
                            </label>
                            <label>
                                Mother's Name:
                                <input
                                    type="text"
                                    name="motherName"
                                    value={updatedStudent.motherName || ''}
                                    onChange={handleInputChange}
                                    placeholder="Mother's Name"
                                />
                            </label>
                            <label>
                                Mother's Occupation:
                                <input
                                    type="text"
                                    name="motherOccupation"
                                    value={updatedStudent.motherOccupation || ''}
                                    onChange={handleInputChange}
                                    placeholder="Mother's Occupation"
                                />
                            </label>
                            <label>
                                Mother's Income:
                                <input
                                    type="text"
                                    name="motherIncome"
                                    value={updatedStudent.motherIncome || ''}
                                    onChange={handleInputChange}
                                    placeholder="Mother's Income"
                                />
                            </label>
                            <label>
                                Mother's Mobile:
                                <input
                                    type="text"
                                    name="motherMobile"
                                    value={updatedStudent.motherMobile || ''}
                                    onChange={handleInputChange}
                                    placeholder="Mother's Mobile"
                                />
                            </label>
                            <label>
                                Residential Address Line 1:
                                <input
                                    type="text"
                                    name="residentialAddress1"
                                    value={updatedStudent.residentialAddress1 || ''}
                                    onChange={handleInputChange}
                                    placeholder="Residential Address Line 1"
                                />
                            </label>
                            <label>
                                Residential Address Line 2:
                                <input
                                    type="text"
                                    name="residentialAddress2"
                                    value={updatedStudent.residentialAddress2 || ''}
                                    onChange={handleInputChange}
                                    placeholder="Residential Address Line 2"
                                />
                            </label>
                            <label>
                                Residential Address Line 3:
                                <input
                                    type="text"
                                    name="residentialAddress3"
                                    value={updatedStudent.residentialAddress3 || ''}
                                    onChange={handleInputChange}
                                    placeholder="Residential Address Line 3"
                                />
                            </label>
                            <label>
                                Residential City:
                                <input
                                    type="text"
                                    name="residentialCity"
                                    value={updatedStudent.residentialCity || ''}
                                    onChange={handleInputChange}
                                    placeholder="Residential City"
                                />
                            </label>
                            <label>
                                Residential State:
                                <input
                                    type="text"
                                    name="residentialState"
                                    value={updatedStudent.residentialState || ''}
                                    onChange={handleInputChange}
                                    placeholder="Residential State"
                                />
                            </label>
                            <label>
                                Residential Pincode:
                                <input
                                    type="text"
                                    name="residentialPincode"
                                    value={updatedStudent.residentialPincode || ''}
                                    onChange={handleInputChange}
                                    placeholder="Residential Pincode"
                                />
                            </label>
                            <label>
                                Local Guardian Name:
                                <input
                                    type="text"
                                    name="localGuardianName"
                                    value={updatedStudent.localGuardianName || ''}
                                    onChange={handleInputChange}
                                    placeholder="Local Guardian Name"
                                />
                            </label>
                            <label>
                                Local Guardian Address Line 1:
                                <input
                                    type="text"
                                    name="localGuardianAddress1"
                                    value={updatedStudent.localGuardianAddress1 || ''}
                                    onChange={handleInputChange}
                                    placeholder="Local Guardian Address Line 1"
                                />
                            </label>
                            <label>
                                Local Guardian Address Line 2:
                                <input
                                    type="text"
                                    name="localGuardianAddress2"
                                    value={updatedStudent.localGuardianAddress2 || ''}
                                    onChange={handleInputChange}
                                    placeholder="Local Guardian Address Line 2"
                                />
                            </label>
                            <label>
                                Local Guardian Address Line 3:
                                <input
                                    type="text"
                                    name="localGuardianAddress3"
                                    value={updatedStudent.localGuardianAddress3 || ''}
                                    onChange={handleInputChange}
                                    placeholder="Local Guardian Address Line 3"
                                />
                            </label>
                            <label>
                                Local Guardian City:
                                <input
                                    type="text"
                                    name="localGuardianCity"
                                    value={updatedStudent.localGuardianCity || ''}
                                    onChange={handleInputChange}
                                    placeholder="Local Guardian City"
                                />
                            </label>
                            <label>
                                Local Guardian State:
                                <input
                                    type="text"
                                    name="localGuardianState"
                                    value={updatedStudent.localGuardianState || ''}
                                    onChange={handleInputChange}
                                    placeholder="Local Guardian State"
                                />
                            </label>
                            <label>
                                Local Guardian Pincode:
                                <input
                                    type="text"
                                    name="localGuardianPincode"
                                    value={updatedStudent.localGuardianPincode || ''}
                                    onChange={handleInputChange}
                                    placeholder="Local Guardian Pincode"
                                />
                            </label>
                            <label>
                                Local Guardian Mobile:
                                <input
                                    type="text"
                                    name="localGuardianMobile"
                                    value={updatedStudent.localGuardianMobile || ''}
                                    onChange={handleInputChange}
                                    placeholder="Local Guardian Mobile"
                                />
                            </label>
                            <label>
                                Siblings:
                                <input
                                    type="text"
                                    name="siblings"
                                    value={updatedStudent.siblings || ''}
                                    onChange={handleInputChange}
                                    placeholder="Siblings"
                                />
                            </label>
                            <label>
                                Student Email:
                                <input
                                    type="email"
                                    name="studentEmail"
                                    value={updatedStudent.studentEmail || ''}
                                    onChange={handleInputChange}
                                    placeholder="Student Email"
                                />
                            </label>
                            <label>
                                Student Mobile:
                                <input
                                    type="text"
                                    name="studentMobile"
                                    value={updatedStudent.studentMobile || ''}
                                    onChange={handleInputChange}
                                    placeholder="Student Mobile"
                                />
                            </label>
                            <label>
                                Religion:
                                <input
                                    type="text"
                                    name="religion"
                                    value={updatedStudent.religion || ''}
                                    onChange={handleInputChange}
                                    placeholder="Religion"
                                />
                            </label>
                            <label>
                                Blood Group:
                                <input
                                    type="text"
                                    name="bloodGroup"
                                    value={updatedStudent.bloodGroup || ''}
                                    onChange={handleInputChange}
                                    placeholder="Blood Group"
                                />
                            </label>
                            <label>
                                Allergies:
                                <input
                                    type="text"
                                    name="allergies"
                                    value={updatedStudent.allergies || ''}
                                    onChange={handleInputChange}
                                    placeholder="Allergies"
                                />
                            </label>
                            <label>
                                Health Problems:
                                <input
                                    type="text"
                                    name="healthProblems"
                                    value={updatedStudent.healthProblems || ''}
                                    onChange={handleInputChange}
                                    placeholder="Health Problems"
                                />
                            </label>
                        </form>
                    ) : (
                        <div className="student-info">
                            <p><strong>Name:</strong> {student.name}</p>
                            <p><strong>Roll Number:</strong> {student.rollNo}</p>
                            <p><strong>Caste:</strong> {student.caste}</p>
                            <p><strong>Community:</strong> {student.community}</p>
                            <p><strong>Class, Branch, Section:</strong> {student.classBranchSection}</p>
                            <p><strong>Year of Study:</strong> {student.yearOfStudy}</p>
                            <p><strong>Father's Name:</strong> {student.fatherName}</p>
                            <p><strong>Father's Occupation:</strong> {student.fatherOccupation}</p>
                            <p><strong>Father's Income:</strong> {student.fatherIncome}</p>
                            <p><strong>Father's Mobile:</strong> {student.fatherMobile}</p>
                            <p><strong>Mother's Name:</strong> {student.motherName}</p>
                            <p><strong>Mother's Occupation:</strong> {student.motherOccupation}</p>
                            <p><strong>Mother's Income:</strong> {student.motherIncome}</p>
                            <p><strong>Mother's Mobile:</strong> {student.motherMobile}</p>
                            <p><strong>Residential Address Line 1:</strong> {student.residentialAddress1}</p>
                            <p><strong>Residential Address Line 2:</strong> {student.residentialAddress2}</p>
                            <p><strong>Residential Address Line 3:</strong> {student.residentialAddress3}</p>
                            <p><strong>Residential City:</strong> {student.residentialCity}</p>
                            <p><strong>Residential State:</strong> {student.residentialState}</p>
                            <p><strong>Residential Pincode:</strong> {student.residentialPincode}</p>
                            <p><strong>Local Guardian Name:</strong> {student.localGuardianName}</p>
                            <p><strong>Local Guardian Address Line 1:</strong> {student.localGuardianAddress1}</p>
                            <p><strong>Local Guardian Address Line 2:</strong> {student.localGuardianAddress2}</p>
                            <p><strong>Local Guardian Address Line 3:</strong> {student.localGuardianAddress3}</p>
                            <p><strong>Local Guardian City:</strong> {student.localGuardianCity}</p>
                            <p><strong>Local Guardian State:</strong> {student.localGuardianState}</p>
                            <p><strong>Local Guardian Pincode:</strong> {student.localGuardianPincode}</p>
                            <p><strong>Local Guardian Mobile:</strong> {student.localGuardianMobile}</p>
                            <p><strong>Siblings:</strong> {student.siblings}</p>
                            <p><strong>Student Email:</strong> {student.studentEmail}</p>
                            <p><strong>Student Mobile:</strong> {student.studentMobile}</p>
                            <p><strong>Religion:</strong> {student.religion}</p>
                            <p><strong>Blood Group:</strong> {student.bloodGroup}</p>
                            <p><strong>Allergies:</strong> {student.allergies}</p>
                            <p><strong>Health Problems:</strong> {student.healthProblems}</p>
                        </div>
                    )}
                    <div className="student-actions">
                        {!isEditing && (
                          <button className="back" onClick={() => navigate('/home')}>Back</button>
                        )}

                        {isEditing ? (
                          <button className="edit" onClick={handleUpdate}>Save</button>
                        ) : (
                          <button className="edit" onClick={() => setIsEditing(true)}>Edit</button>
                        )}

                        <button className="delete" onClick={handleDelete}>Delete</button>

                        {loading ? (
                          <>
                            <div className="spinner"></div>
                          </>
                        ) : (
                          <>
                            <button className="download" onClick={handleDownloadPDF}>Generate PDF</button>
                            {pdfUrl && (
                              <a href={pdfUrl} download={`${student.name}_${student.rollNo}.pdf`} className="download">Download PDF</a>
                            )}
                          </>
                        )}
                        <br /><br />
                      </div>
                      {loading && (
                        <div className="loading-bar-container">
                              <div className="loading-bar" style={{ width: `${progress}%` }}></div>
                              <span className="loading-percentage">{progress}%</span>
                        </div>
                        )}
                        <div className="messages">
    {/* Show the success message if it exists */}
    {successMessage && (
        <div className="success-message">
            {successMessage}
        </div>
    )}

    {/* Show the error message only if there is no success message */}
    {!successMessage && errorMessage && (
        <div className="error-message">
            {errorMessage}
        </div>
    )}
</div>
                    
                    </div>

            ) : (
                <p>Loading student details...</p>
            )}
        </div>
    );
};

export default StudentDetails;

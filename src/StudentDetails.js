import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { storage } from './firebase'; // Import Firebase storage
import { getDownloadURL, ref } from 'firebase/storage'; // Import required Firebase functions
import './StudentDetails.css';

const URL = process.env.REACT_APP_SERVER_URL;

const StudentDetails = () => {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedStudent, setUpdatedStudent] = useState({});
    const [imageUrl, setImageUrl] = useState(''); // State to hold the image URL
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [imageBlob, setImageBlob] = useState(null);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await Axios.get(`${URL}/student/${id}`);
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
            await Axios.put(`${URL}/update-student/${id}`, updatedStudent);
            setStudent(updatedStudent);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating student:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await Axios.delete(`${URL}/delete-student/${id}`);
            navigate('/root');
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    const generatePDF = async () => {
        setLoading(true); 
        setProgress(0);
        console.log(imageBlob);
        // Create the LaTeX document as a string
        const latexContent = String.raw`
\documentclass[a4paper]{article}
\usepackage[margin=1cm]{geometry}
\usepackage{array}
\usepackage{xcolor}
\usepackage{colortbl}
\usepackage{graphicx}
\usepackage{catchfile}

% Add these packages for URL image support
\usepackage{catchfile}
\usepackage{currfile}
\usepackage{ifthen}


\newcommand{\sectiontitle}[1]{\textbf{\large #1}}
\newcommand{\fieldname}[1]{\textbf{#1:}}
\newcommand{\fieldvalue}[1]{\texttt{#1}}

\begin{document}

\begin{center}
    \texttt{\Large\textbf{Student Details}}
    
 \vspace{0.5cm}
% Assuming the file is saved locally as 'student_photo.jpg'
\includegraphics[width=0.3\textwidth]{temp/student-passport-photo.jpg}

    \vspace{0.5cm}
    \texttt{\large\textbf{${student.name}}}
\end{center}

\vspace{1cm}

\noindent
\begin{minipage}[t]{0.48\textwidth}
    \sectiontitle{Personal Information}
    \begin{tabular}{@{} >{\raggedright\arraybackslash}p{0.4\linewidth} p{0.6\linewidth} @{}}
        \rowcolor[gray]{0.9} \multicolumn{2}{l}{\textbf{Basic Details}} \\
        \fieldname{Name} & \fieldvalue{${student.name}} \\
        \fieldname{Roll Number} & \fieldvalue{${student.rollNo}} \\
        \fieldname{Class, Branch, Section} & \fieldvalue{${student.classBranchSection}} \\
        \fieldname{Year of Study} & \fieldvalue{${student.yearOfStudy}} \\
        \rowcolor[gray]{0.9} \multicolumn{2}{l}{\textbf{Father's Details}} \\
        \fieldname{Name} & \fieldvalue{${student.fatherName}} \\
        \fieldname{Occupation} & \fieldvalue{${student.fatherOccupation}} \\
        \fieldname{Mobile} & \fieldvalue{${student.fatherMobile}} \\
        \rowcolor[gray]{0.9} \multicolumn{2}{l}{\textbf{Mother's Details}} \\
        \fieldname{Name} & \fieldvalue{${student.motherName}} \\
        \fieldname{Occupation} & \fieldvalue{${student.motherOccupation}} \\
        \fieldname{Mobile} & \fieldvalue{${student.motherMobile}} \\
    \end{tabular}
\end{minipage}
\hfill
\begin{minipage}[t]{0.48\textwidth}
    \sectiontitle{Contact Information}
    \begin{tabular}{@{} >{\raggedright\arraybackslash}p{0.4\linewidth} p{0.6\linewidth} @{}}
        \rowcolor[gray]{0.9} \multicolumn{2}{l}{\textbf{Residential Address}} \\
        \fieldname{Address Line 1} & \fieldvalue{${student.residentialAddress1}} \\
        \fieldname{Line 2} & \fieldvalue{${student.residentialAddress2}} \\
        \fieldname{Line 3} & \fieldvalue{${student.residentialAddress3}} \\
        \fieldname{City} & \fieldvalue{${student.residentialCity}} \\
        \fieldname{State} & \fieldvalue{${student.residentialState}} \\
        \fieldname{Pincode} & \fieldvalue{${student.residentialPincode}} \\
        \rowcolor[gray]{0.9} \multicolumn{2}{l}{\textbf{Student Contact}} \\
        \fieldname{Email} & \fieldvalue{${student.studentEmail}} \\
        \fieldname{Mobile} & \fieldvalue{${student.studentMobile}} \\
    \end{tabular}
\end{minipage}

\vspace{1cm}

\noindent
\begin{minipage}[t]{0.48\textwidth}
    \sectiontitle{Additional Information}
    \begin{tabular}{@{} >{\raggedright\arraybackslash}p{0.4\linewidth} p{0.6\linewidth} @{}}
        \rowcolor[gray]{0.9} \multicolumn{2}{l}{\textbf{Siblings}} \\
        \fieldname{Siblings} & \fieldvalue{${student.siblings}} \\
        \rowcolor[gray]{0.9} \multicolumn{2}{l}{\textbf{Health Information}} \\
        \fieldname{Blood Group} & \fieldvalue{${student.bloodGroup}} \\
        \fieldname{Allergies} & \fieldvalue{${student.allergies}} \\
        \fieldname{Health Problems} & \fieldvalue{${student.healthProblems}} \\
    \end{tabular}
\end{minipage}
\hfill
\begin{minipage}[t]{0.48\textwidth}
    \sectiontitle{Local Guardian Information}
    \begin{tabular}{@{} >{\raggedright\arraybackslash}p{0.4\linewidth} p{0.6\linewidth} @{}}
        \rowcolor[gray]{0.9} \multicolumn{2}{l}{\textbf{Guardian Details}} \\
        \fieldname{Name} & \fieldvalue{${student.localGuardianName}} \\
        \fieldname{Mobile} & \fieldvalue{${student.localGuardianMobile}} \\
        \fieldname{Relationship} & \fieldvalue{${student.localGuardianRelationship}} \\
        \rowcolor[gray]{0.9} \multicolumn{2}{l}{\textbf{Guardian Address}} \\
        \fieldname{Line 1} & \fieldvalue{${student.localGuardianAddress1}} \\
        \fieldname{Line 2} & \fieldvalue{${student.localGuardianAddress2}} \\
        \fieldname{Line 3} & \fieldvalue{${student.localGuardianAddress3}} \\
        \fieldname{City} & \fieldvalue{${student.localGuardianCity}} \\
        \fieldname{State} & \fieldvalue{${student.localGuardianState}} \\
        \fieldname{Pincode} & \fieldvalue{${student.localGuardianPincode}} \\
    \end{tabular}
\end{minipage}

\end{document}
    `;
        console.log(imageBlob);
    
        console.log(latexContent);
    
        try {


            let simulatedProgress = 0;
        const interval = setInterval(() => {
            simulatedProgress += 10;
            if (simulatedProgress >= 100) {
                clearInterval(interval);
            }
            setProgress(simulatedProgress);
        }, 300); 
        const formData = new FormData();
        formData.append('latex', latexContent);  // Append LaTeX content
        formData.append('image', imageBlob, 'student-passport-photo.jpg');  // Append the image blob
        
        const response = await fetch('https://latextopdfhosteldb.azurewebsites.net/convert', {
            method: 'POST',
            body: formData,
          });
          
          console.log(response);
          
          // Check if the response is OK (status in the range 200-299)
          if (!response.ok) {
            const text = await response.text(); // Get the error message in text format
            throw new Error(`API request failed with status ${response.status}: ${text}`);
          }
          
          // Convert the response to a Blob (binary data for the PDF)
          const pdfBlob = await response.blob();
          console.log(pdfBlob); // Log the Blob object to see the binary data
          
          // Create a download link for the Blob
          const url = window.URL.createObjectURL(pdfBlob); // Create a URL from the Blob
          const link = document.createElement('a'); // Create a link element
          link.href = url;
          link.download = `${student.name}_${student.rollNo}.pdf`; // Set the filename for download
          document.body.appendChild(link); // Append link to the body
          link.click(); // Programmatically click the link to trigger download
          link.remove(); // Remove the link from the DOM
          
          // Optional: Release the URL object after the download
          window.URL.revokeObjectURL(url);
          
          // Clear the progress interval if necessary and update UI
          clearInterval(interval);
          setProgress(100); 
          
        } catch (error) {
            console.error('Error generating PDF:', error);
        }finally {
            setLoading(false); // Stop loading animation
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
                    {!isEditing && <button className="back" onClick={() => navigate('/home')}>Back</button>}
                        {isEditing ? (
                            <button className="edit" onClick={handleUpdate}>Save</button>
                                ) : (
                            <button className="edit" onClick={() => setIsEditing(true)}>Edit</button>
                                )}
                            <button className="delete" onClick={handleDelete}>Delete</button>
                            
                            {loading ? (
                    <div className="spinner"></div>
                ) : (
                    <button className="download" onClick={generatePDF}>Download PDF</button>
                )}
            </div>

            {loading && (
                <div className="loading-bar-container">
                    <div className="loading-bar" style={{ width: `${progress}%` }}></div>
                </div>
            )}

                    </div>

            ) : (
                <p>Loading student details...</p>
            )}
        </div>
    );
};

export default StudentDetails;

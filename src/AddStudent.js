import React, { useState } from 'react';
import './AddStudent.css';
import Axios from 'axios';
import { collection, addDoc, updateDoc, doc } from "firebase/firestore"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from './firebase'; // Ensure correct import path for your Firebase configuration

const URL = process.env.REACT_APP_SERVER_URL;

const AddStudent = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [photoLabel, setPhotoLabel] = useState('Choose file...');
    const [photoError, setPhotoError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null); // State to store selected file
    const [communityError, setCommunityError] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        rollNo: '',
        caste: '',
        community: '',
        classBranchSection: '',
        yearOfStudy: '',
        fatherName: '',
        fatherOccupation: '',
        fatherIncome: '',
        fatherMobile: '',
        motherName: '',
        motherOccupation: '',
        motherIncome: '',
        motherMobile: '',
        residentialAddress1: '',
        residentialAddress2: '',
        residentialAddress3: '',
        residentialCity: '',
        residentialState: '',
        residentialPincode: '',
        localGuardianName: '',
        localGuardianAddress1: '',
        localGuardianAddress2: '',
        localGuardianAddress3: '',
        localGuardianCity: '',
        localGuardianState: '',
        localGuardianPincode: '',
        localGuardianMobile: '',
        siblings: '',
        studentEmail: '',
        studentMobile: '',
        religion: '',
        bloodGroup: '',
        allergies: '',
        healthProblems: '',
    });
    const [emptyFields, setEmptyFields] = useState([]);

    

    const handlePhotoChange = (event) => {
        const file = event.target.files[0]; // Access files directly from event.target
        if (file) {
            if (file.size > 100 * 1024) {
                setPhotoLabel('Choose file...');
                setPhotoError('File size must be less than 100kb.');
                setSelectedFile(null); // Reset selected file
            } else {
                setPhotoLabel(file.name);
                setPhotoError('');
                setSelectedFile(file); // Set selected file to state
            }
        } else {
            setPhotoLabel('Choose file...');
            setPhotoError('');
            setSelectedFile(null); // Reset selected file
        }
    };

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData({ ...formData, [id]: value });
        // Remove field from emptyFields if filled
        if (emptyFields.includes(id)) {
            setEmptyFields(emptyFields.filter(field => field !== id));
        }
    };
    
    const handleCommunityChange = (e) => {
        const { value } = e.target;
        setFormData({
            ...formData,
            community: value,
        });
        setCommunityError(false); // Reset community error when a selection is made
    };
    const nextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const previousStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let fields = [];
        // Check for empty fields
        for (const key in formData) {
            if (!formData[key]) {
                fields.push(key);
            }
        }

        // Highlight empty fields in red
        setEmptyFields(fields);

        if (fields.length > 0 && !selectedFile) {
            alert(`Please fill in all required fields.`);
            return;
        }

        try {
            // Add form data to Firestore
            const response = await Axios.post(`${URL}/add-student`, formData);
            console.log('Student added successfully:', response.data);

            const docRef = await addDoc(collection(db, "students"), formData);
            console.log("Document written with ID: ", docRef.id);

            // Upload photo to Firebase Storage if a file is selected
            if (selectedFile) {
                if (selectedFile.size > 100 * 1024) {
                    setPhotoLabel('Choose file...');
                    setPhotoError('File size must be less than 100kb.');
                    return; // Stop further processing
                }

                const storageRef = ref(storage, `studentDetails/${formData.rollNo}/passportsizephoto.jpg`);
                await uploadBytes(storageRef, selectedFile);

                // Optionally, update Firestore with photo URL if needed
                const photoURL = await getDownloadURL(storageRef);
                await updateDoc(doc(db, "students", docRef.id), {
                    photoURL: photoURL
                });
            }

            // Reset form state or navigate somewhere else
            setFormData({
                name: '',
                rollNo: '',
                caste: '',
                classBranchSection: '',
                yearOfStudy: '',
                fatherName: '',
                fatherOccupation: '',
                fatherIncome: '',
                fatherMobile: '',
                motherName: '',
                motherOccupation: '',
                motherIncome: '',
                motherMobile: '',
                residentialAddress1: '',
                residentialAddress2: '',
                residentialAddress3: '',
                residentialCity: '',
                residentialState: '',
                residentialPincode: '',
                localGuardianName: '',
                localGuardianAddress1: '',
                localGuardianAddress2: '',
                localGuardianAddress3: '',
                localGuardianCity: '',
                localGuardianState: '',
                localGuardianPincode: '',
                localGuardianMobile: '',
                siblings: '',
                studentEmail: '',
                studentMobile: '',
                religion: '',
                bloodGroup: '',
                allergies: '',
                healthProblems: '',
            });
            setPhotoLabel('Choose file...');
            setPhotoError('');
            setCurrentStep(1);
            setEmptyFields([]);

            alert('Student details submitted successfully!');
        } catch (error) {
            console.error("Error adding document: ", error);
            alert('Error submitting student details. Please try again.');
        }
    };
    
    return (
        <div className="add-student-container">
            <div className="container">
                <form onSubmit={handleSubmit}>
                    {currentStep === 1 && (
                        <div>
                            <h1>Resident Details</h1>
                            <div className="row mb-3">
                                <div className={`col-md-5 ${emptyFields.includes('name') ? 'has-error' : ''}`}>
                                    <label htmlFor="name" className="form-label">Name of the Applicant (In Capital Letters)</label>
                                    <input type="text" className={`form-control ${emptyFields.includes('name') ? 'is-invalid' : ''}`} id="name"  value={formData.name} onChange={handleInputChange} required />
                                    {emptyFields.includes('name') && <div className="invalid-feedback">Please enter the name.</div>}
                                </div>
                                <div className={`col-md-6 ${emptyFields.includes('photo') ? 'has-error' : ''}`}>
                                    <label htmlFor="photo" className="form-label">Upload Passport Size Photo (up to 100kb)</label>
                                    <div className="custom-file">
                                        <input type="file" className={`custom-file-input ${emptyFields.includes('photo') ? 'is-invalid' : ''}`} id="photo" accept="image/*" onChange={handlePhotoChange} />
                                        <label className="custom-file-label" htmlFor="photo">{photoLabel}</label>
                                    </div>
                                    {photoError && <small className="text-danger">{photoError}</small>}
                                    {emptyFields.includes('photo') && <div className="invalid-feedback">Please upload a photo.</div>}
                                </div>
                            </div>
                            <div className='row mb-3'>
                                <div className={`col-md-4 ${emptyFields.includes('rollNo') ? 'has-error' : ''}`}>
                                    <label htmlFor="rollNo" className="form-label">Roll No.</label>
                                    <input type="text" className={`form-control ${emptyFields.includes('rollNo') ? 'is-invalid' : ''}`} id="rollNo" value={formData.rollNo} onChange={handleInputChange} required />
                                    {emptyFields.includes('rollNo') && <div className="invalid-feedback">Please enter the roll number.</div>}
                                </div>
                                <div className={`col-md-8 ${emptyFields.includes('classBranchSection') ? 'has-error' : ''}`}>
                                    <label htmlFor="classBranchSection" className="form-label">Department</label>
                                    <input type="text" className={`form-control ${emptyFields.includes('classBranchSection') ? 'is-invalid' : ''}`} id="classBranchSection" value={formData.classBranchSection} onChange={handleInputChange} required />
                                    {emptyFields.includes('classBranchSection') && <div className="invalid-feedback">Please enter the department.</div>}
                                </div>
                            </div>
                            <div className='row mb-3'>
                                <div className={`col-md-6 ${emptyFields.includes('yearOfStudy') ? 'has-error' : ''}`}>
                                    <label htmlFor="yearOfStudy" className="form-label">Year of Study</label>
                                    <input type="number" className={`form-control ${emptyFields.includes('yearOfStudy') ? 'is-invalid' : ''}`} id="yearOfStudy" value={formData.yearOfStudy} onChange={handleInputChange} required />
                                    {emptyFields.includes('yearOfStudy') && <div className="invalid-feedback">Please enter the year of study.</div>}
                                </div>
                            </div>
                            <div className="row mb-3">
                            <div className={`col-md-6 ${emptyFields.includes('studentMobile') ? 'has-error' : ''}`}>
                                <label htmlFor="studentMobile" className="form-label">Student's Mobile Number</label>
                                <input type="number" className={`form-control ${emptyFields.includes('studentMobile') ? 'is-invalid' : ''}`} id="studentMobile" value={formData.studentMobile} onChange={handleInputChange} required />
                                {emptyFields.includes('studentMobile') && <div className="invalid-feedback">Please enter the student's mobile number.</div>}
                            </div>
                            <div className={`col-md-6 ${emptyFields.includes('studentEmail') ? 'has-error' : ''}`}>
                                <label htmlFor="studentEmail" className="form-label">Student's Email ID</label>
                                <input type="email" className={`form-control ${emptyFields.includes('studentEmail') ? 'is-invalid' : ''}`} id="studentEmail" value={formData.studentEmail} onChange={handleInputChange} required />
                                {emptyFields.includes('studentEmail') && <div className="invalid-feedback">Please enter the student's email address.</div>}
                            </div>
                            </div>
                            <div className='row mb-3'>
                            <div className={`col-md-4 ${emptyFields.includes('caste') ? 'has-error' : ''}`}>
                                <label htmlFor="caste" className="form-label">Caste</label>
                                <input type="text" className={`form-control ${emptyFields.includes('caste') ? 'is-invalid' : ''}`} id="caste" value={formData.caste} onChange={handleInputChange} required />
                                {emptyFields.includes('caste') && <div className="invalid-feedback">Please enter the caste.</div>}
                            </div>
                            <div className={`col-md-4 ${emptyFields.includes('religion') ? 'has-error' : ''}`}>
                                <label htmlFor="religion" className="form-label">Religion</label>
                                <input type="text" className={`form-control ${emptyFields.includes('religion') ? 'is-invalid' : ''}`} id="religion" value={formData.religion} onChange={handleInputChange} required />
                                {emptyFields.includes('religion') && <div className="invalid-feedback">Please enter the religion.</div>}
                            </div>
                        </div>
            <div className="row mb-3">
                <div className="col-md-12">
                    <label className="form-label">Community</label>
                    <div>
                        <input
                            type="radio"
                            className='form-check-input'
                            id="community-oc"
                            name="community"
                            value="OC"
                            checked={formData.community === 'OC'}
                            onChange={handleCommunityChange}
                        />
                        <label htmlFor="community-oc" className="form-check-label radio-label">OC</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            id="community-bc"
                            className='form-check-input'
                            name="community"
                            value="BC"
                            checked={formData.community === 'BC'}
                            onChange={handleCommunityChange}
                        />
                        <label htmlFor="community-bc" className="form-check-label radio-label">BC</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            id="community-mbc"
                            className='form-check-input'
                            name="community"
                            value="MBC-DNC"
                            checked={formData.community === 'MBC-DNC'}
                            onChange={handleCommunityChange}
                        />
                        <label htmlFor="community-mbc" className="form-check-label radio-label">MBC – DNC</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            className='form-check-input'
                            id="community-sc"
                            name="community"
                            value="SC"
                            checked={formData.community === 'SC'}
                            onChange={handleCommunityChange}
                        />
                        <label htmlFor="community-sc" className="form-check-label radio-label">SC</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            className='form-check-input'
                            id="community-st"
                            name="community"
                            value="ST"
                            checked={formData.community === 'ST'}
                            onChange={handleCommunityChange}
                        />
                        <label htmlFor="community-st" className="form-check-label radio-label">ST</label>
                    </div>
                </div>
            </div>
            {communityError && <div className="alert alert-danger">Please select a community.</div>}
                {/* Other form elements */}

                <div className="row mb-3">
    <div className={`col-md-4 ${emptyFields.includes('residentialAddress1') ? 'has-error' : ''}`}>
        <label htmlFor="residentialAddress1" className="form-label">Address Line 1</label>
        <input type="text" className={`form-control ${emptyFields.includes('residentialAddress1') ? 'is-invalid' : ''}`} id="residentialAddress1" value={formData.residentialAddress1} onChange={handleInputChange} required />
        {emptyFields.includes('residentialAddress1') && <div className="invalid-feedback">Please enter address line 1.</div>}
    </div>
    <div className={`col-md-4 ${emptyFields.includes('residentialAddress2') ? 'has-error' : ''}`}>
        <label htmlFor="residentialAddress2" className="form-label">Address Line 2</label>
        <input type="text" className={`form-control ${emptyFields.includes('residentialAddress2') ? 'is-invalid' : ''}`} id="residentialAddress2" value={formData.residentialAddress2} onChange={handleInputChange} required />
        {emptyFields.includes('residentialAddress2') && <div className="invalid-feedback">Please enter address line 2.</div>}
    </div>
    <div className={`col-md-4 ${emptyFields.includes('residentialAddress3') ? 'has-error' : ''}`}>
        <label htmlFor="residentialAddress3" className="form-label">Address Line 3</label>
        <input type="text" className={`form-control ${emptyFields.includes('residentialAddress3') ? 'is-invalid' : ''}`} id="residentialAddress3" value={formData.residentialAddress3} onChange={handleInputChange} />
        {emptyFields.includes('residentialAddress3') && <div className="invalid-feedback">Please enter address line 3.</div>}
    </div>
</div>
<div className="row mb-3">
    <div className={`col-md-4 ${emptyFields.includes('residentialCity') ? 'has-error' : ''}`}>
        <label htmlFor="residentialCity" className="form-label">City</label>
        <input type="text" className={`form-control ${emptyFields.includes('residentialCity') ? 'is-invalid' : ''}`} id="residentialCity" value={formData.residentialCity} onChange={handleInputChange} required />
        {emptyFields.includes('residentialCity') && <div className="invalid-feedback">Please enter the city.</div>}
    </div>
    <div className={`col-md-4 ${emptyFields.includes('residentialState') ? 'has-error' : ''}`}>
        <label htmlFor="residentialState" className="form-label">State</label>
        <input type="text" className={`form-control ${emptyFields.includes('residentialState') ? 'is-invalid' : ''}`} id="residentialState" value={formData.residentialState} onChange={handleInputChange} required />
        {emptyFields.includes('residentialState') && <div className="invalid-feedback">Please enter the state.</div>}
    </div>
    <div className={`col-md-4 ${emptyFields.includes('residentialPincode') ? 'has-error' : ''}`}>
        <label htmlFor="residentialPincode" className="form-label">Pincode</label>
        <input type="number" className={`form-control ${emptyFields.includes('residentialPincode') ? 'is-invalid' : ''}`} id="residentialPincode" value={formData.residentialPincode} onChange={handleInputChange} required />
        {emptyFields.includes('residentialPincode') && <div className="invalid-feedback">Please enter the pincode.</div>}
    </div>
</div>

</div>

                           
    
                    )}

                    {currentStep === 2 && (
                        <div>
                            <h1>Parents' Details</h1>
                            <div className="row mb-3">
                                <div className={`col-md-4 ${emptyFields.includes('fatherName') ? 'has-error' : ''}`}>
                                    <label htmlFor="fatherName" className="form-label">Father's/Guardian's Name</label>
                                    <input type="text" className={`form-control ${emptyFields.includes('fatherName') ? 'is-invalid' : ''}`} id="fatherName" value={formData.fatherName} onChange={handleInputChange} required />
                                    {emptyFields.includes('fatherName') && <div className="invalid-feedback">Please enter the father's name.</div>}
                                </div>
                                <div className={`col-md-4 ${emptyFields.includes('fatherOccupation') ? 'has-error' : ''}`}>
                                    <label htmlFor="fatherOccupation" className="form-label">Occupation</label>
                                    <input type="text" className={`form-control ${emptyFields.includes('fatherOccupation') ? 'is-invalid' : ''}`} id="fatherOccupation" value={formData.fatherOccupation} onChange={handleInputChange} required />
                                    {emptyFields.includes('fatherOccupation') && <div className="invalid-feedback">Please enter the father's occupation.</div>}
                                </div>
                                <div className={`col-md-4 ${emptyFields.includes('fatherIncome') ? 'has-error' : ''}`}>
                                    <label htmlFor="fatherIncome" className="form-label">Annual Income</label>
                                    <input type="number" className={`form-control ${emptyFields.includes('fatherIncome') ? 'is-invalid' : ''}`} id="fatherIncome" value={formData.fatherIncome} onChange={handleInputChange} required />
                                    {emptyFields.includes('fatherIncome') && <div className="invalid-feedback">Please enter the father's annual income.</div>}
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className={`col-md-4 ${emptyFields.includes('fatherMobile') ? 'has-error' : ''}`}>
                                    <label htmlFor="fatherMobile" className="form-label">Father's Mobile Number</label>
                                    <input type="number" className={`form-control ${emptyFields.includes('fatherMobile') ? 'is-invalid' : ''}`} id="fatherMobile" value={formData.fatherMobile} onChange={handleInputChange} required />
                                    {emptyFields.includes('fatherMobile') && <div className="invalid-feedback">Please enter the father's mobile number.</div>}
                                </div>
                                
                            </div>
                            <div className="row mb-3">
                            <div className={`col-md-4 ${emptyFields.includes('motherName') ? 'has-error' : ''}`}>
                                    <label htmlFor="motherName" className="form-label">Mother's/Guardian's Name</label>
                                    <input type="text" className={`form-control ${emptyFields.includes('motherName') ? 'is-invalid' : ''}`} id="motherName" value={formData.motherName} onChange={handleInputChange} required />
                                    {emptyFields.includes('motherName') && <div className="invalid-feedback">Please enter the mother's name.</div>}
                                </div>
                                <div className={`col-md-4 ${emptyFields.includes('motherOccupation') ? 'has-error' : ''}`}>
                                    <label htmlFor="motherOccupation" className="form-label">Occupation</label>
                                    <input type="text" className={`form-control ${emptyFields.includes('motherOccupation') ? 'is-invalid' : ''}`} id="motherOccupation" value={formData.motherOccupation} onChange={handleInputChange} required />
                                    {emptyFields.includes('motherOccupation') && <div className="invalid-feedback">Please enter the mother's occupation.</div>}
                                </div>
                                <div className={`col-md-4 ${emptyFields.includes('motherIncome') ? 'has-error' : ''}`}>
                                    <label htmlFor="motherIncome" className="form-label">Annual Income</label>
                                    <input type="number" className={`form-control ${emptyFields.includes('motherIncome') ? 'is-invalid' : ''}`} id="motherIncome" value={formData.motherIncome} onChange={handleInputChange} required />
                                    {emptyFields.includes('motherIncome') && <div className="invalid-feedback">Please enter the mother's annual income.</div>}
                                </div>
                                <div className={`col-md-4 ${emptyFields.includes('motherMobile') ? 'has-error' : ''}`}>
                                    <label htmlFor="motherMobile" className="form-label">Mother's Mobile Number</label>
                                    <input type="number" className={`form-control ${emptyFields.includes('motherMobile') ? 'is-invalid' : ''}`} id="motherMobile" value={formData.motherMobile} onChange={handleInputChange} required />
                                    {emptyFields.includes('motherMobile') && <div className="invalid-feedback">Please enter the mother's mobile number.</div>}
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div>
                            <h1>Local Guardian Details</h1>
                            <div className="row mb-3">
                                <div className={`col-md-6 ${emptyFields.includes('localGuardianName') ? 'has-error' : ''}`}>
                                    <label htmlFor="localGuardianName" className="form-label">Local Guardian's Name</label>
                                    <input type="text" className={`form-control ${emptyFields.includes('localGuardianName') ? 'is-invalid' : ''}`} id="localGuardianName" value={formData.localGuardianName} onChange={handleInputChange} required />
                                    {emptyFields.includes('localGuardianName') && <div className="invalid-feedback">Please enter the local guardian's name.</div>}
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className={`col-md-4 ${emptyFields.includes('localGuardianAddress1') ? 'has-error' : ''}`}>
                                    <label htmlFor="localGuardianAddress1" className="form-label">Address Line 1</label>
                                    <input type="text" className={`form-control ${emptyFields.includes('localGuardianAddress1') ? 'is-invalid' : ''}`} id="localGuardianAddress1" value={formData.localGuardianAddress1} onChange={handleInputChange} required />
                                    {emptyFields.includes('localGuardianAddress1') && <div className="invalid-feedback">Please enter address line 1.</div>}
                                </div>
                                <div className={`col-md-4 ${emptyFields.includes('localGuardianAddress2') ? 'has-error' : ''}`}>
                                    <label htmlFor="localGuardianAddress2" className="form-label">Address Line 2</label>
                                    <input type="text" className={`form-control ${emptyFields.includes('localGuardianAddress2') ? 'is-invalid' : ''}`} id="localGuardianAddress2" value={formData.localGuardianAddress2} onChange={handleInputChange} required />
                                    {emptyFields.includes('localGuardianAddress2') && <div className="invalid-feedback">Please enter address line 2.</div>}
                                </div>
                                <div className={`col-md-4 ${emptyFields.includes('localGuardianAddress3') ? 'has-error' : ''}`}>
                                    <label htmlFor="localGuardianAddress3" className="form-label">Address Line 3</label>
                                    <input type="text" className={`form-control ${emptyFields.includes('localGuardianAddress3') ? 'is-invalid' : ''}`} id="localGuardianAddress3" value={formData.localGuardianAddress3} onChange={handleInputChange} />
                                    {emptyFields.includes('localGuardianAddress3') && <div className="invalid-feedback">Please enter address line 3.</div>}
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className={`col-md-4 ${emptyFields.includes('localGuardianCity') ? 'has-error' : ''}`}>
                                    <label htmlFor="localGuardianCity" className="form-label">City</label>
                                    <input type="text" className={`form-control ${emptyFields.includes('localGuardianCity') ? 'is-invalid' : ''}`} id="localGuardianCity" value={formData.localGuardianCity} onChange={handleInputChange} required />
                                    {emptyFields.includes('localGuardianCity') && <div className="invalid-feedback">Please enter the city.</div>}
                                </div>
                                <div className={`col-md-4 ${emptyFields.includes('localGuardianState') ? 'has-error' : ''}`}>
                                    <label htmlFor="localGuardianState" className="form-label">State</label>
                                    <input type="text" className={`form-control ${emptyFields.includes('localGuardianState') ? 'is-invalid' : ''}`} id="localGuardianState" value={formData.localGuardianState} onChange={handleInputChange} required />
                                    {emptyFields.includes('localGuardianState') && <div className="invalid-feedback">Please enter the state.</div>}
                                </div>
                                <div className={`col-md-4 ${emptyFields.includes('localGuardianPincode') ? 'has-error' : ''}`}>
                                    <label htmlFor="localGuardianPincode" className="form-label">Pincode</label>
                                    <input type="number" className={`form-control ${emptyFields.includes('localGuardianPincode') ? 'is-invalid' : ''}`} id="localGuardianPincode" value={formData.localGuardianPincode} onChange={handleInputChange} required />
                                    {emptyFields.includes('localGuardianPincode') && <div className="invalid-feedback">Please enter the pincode.</div>}
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className={`col-md-6 ${emptyFields.includes('localGuardianMobile') ? 'has-error' : ''}`}>
                                    <label htmlFor="localGuardianMobile" className="form-label"> Guardian's Mobile Number</label>
                                    <input type="number" className={`form-control ${emptyFields.includes('localGuardianMobile') ? 'is-invalid' : ''}`} id="localGuardianMobile" value={formData.localGuardianMobile} onChange={handleInputChange} required />
                                    {emptyFields.includes('localGuardianMobile') && <div className="invalid-feedback">Please enter the father's mobile number.</div>}
                                </div>
                                
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div>
                            <h1>Additional Details</h1>
                            <div className="row mb-3">
                                <div className={`col-md-4 ${emptyFields.includes('siblings') ? 'has-error' : ''}`}>
                                    <label htmlFor="siblings" className="form-label">No. of Siblings</label>
                                    <input type="number" className={`form-control ${emptyFields.includes('siblings') ? 'is-invalid' : ''}`} id="siblings" value={formData.siblings} onChange={handleInputChange} required />
                                    {emptyFields.includes('siblings') && <div className="invalid-feedback">Please enter the number of siblings.</div>}
                                </div>
                                <div className={`col-md-4 ${emptyFields.includes('bloodGroup') ? 'has-error' : ''}`}>
                                    <label htmlFor="bloodGroup" className="form-label">Blood Group</label>
                                    <input type="text" className={`form-control ${emptyFields.includes('bloodGroup') ? 'is-invalid' : ''}`} id="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} required />
                                    {emptyFields.includes('bloodGroup') && <div className="invalid-feedback">Please enter the blood group.</div>}
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className={`col-md-8 ${emptyFields.includes('siblingdetails') ? 'has-error' : ''}`}>
                                    <label htmlFor="siblingdetails" className="form-label">Furnish details of Brothers / Sisters : studying / Staying at TCE/ Relative employed at TCE</label>
                                    <textarea type="number" rows="3" className={`form-control ${emptyFields.includes('siblingdetails') ? 'is-invalid' : ''}`} id="siblingdetails" value={formData.siblingdetails} onChange={handleInputChange} required />
                                    {emptyFields.includes('siblingdetails') && <div className="invalid-feedback">Please enter the number of siblings.</div>}
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className={`col-md-8 ${emptyFields.includes('allergies') ? 'has-error' : ''}`}>
                                    <label htmlFor="allergies" className="form-label">Any Known Allergies</label>
                                    <textarea type="text" rows="2" className={`form-control ${emptyFields.includes('allergies') ? 'is-invalid' : ''}`} id="allergies" value={formData.allergies} onChange={handleInputChange} />
                                    {emptyFields.includes('allergies') && <div className="invalid-feedback">Please enter any known allergies.</div>}
                                </div>
                                <div className={`col-md-12 ${emptyFields.includes('healthProblems') ? 'has-error' : ''}`}>
                                    <label htmlFor="healthProblems" className="form-label">Is there any specific health problem? If so
                                    furnish the details of first aid to be given</label>
                                    <textarea type="text" rows="2" className={`form-control ${emptyFields.includes('healthProblems') ? 'is-invalid' : ''}`} id="healthProblems" value={formData.healthProblems} onChange={handleInputChange} />
                                    {emptyFields.includes('healthProblems') && <div className="invalid-feedback">Please enter any other health problems.</div>}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="row mt-4">
                    <div className="button-container">
                        {currentStep > 1 && (
                            <div className="left-button">
                                <button type="button" className="btn btn-secondary" onClick={previousStep}>Previous</button>
                            </div>
                        )}
                        {currentStep < 4 && (
                            <div className="right-button">
                                <button type="button" className="btn btn-primary" onClick={nextStep}>Next</button>
                            </div>
                        )}
                        {currentStep === 4 && (
                            <div className="right-button">
                                <button type="submit" className="btn btn-success">Submit</button>
                            </div>
                        )}
                    </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStudent;

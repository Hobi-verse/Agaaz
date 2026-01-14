// RegistrationForm - Dynamic form that changes based on selected sport type
import { useState, useEffect } from 'react';
import FormInput from './FormInput';
import FileUpload from './FileUpload';
import { isTeamSport, getSportTypeLabel } from '../data/sportsData';

const RegistrationForm = ({ selectedSport, onSubmit, isLoading }) => {
    const [formData, setFormData] = useState({
        name: '',
        universityName: '',
        branch: '',
        teamName: '',
        mobileNo: '',
        email: '',
        aadharNo: '',
        aadharPhoto: null,
    });

    const [errors, setErrors] = useState({});
    const showTeamField = selectedSport && isTeamSport(selectedSport.type);

    // Reset form when sport changes
    useEffect(() => {
        setFormData({
            name: '',
            universityName: '',
            branch: '',
            teamName: '',
            mobileNo: '',
            email: '',
            aadharNo: '',
            aadharPhoto: null,
        });
        setErrors({});
    }, [selectedSport?.id]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData(prev => ({ ...prev, [name]: files[0] || null }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 3) {
            newErrors.name = 'Name must be at least 3 characters';
        }

        if (!formData.universityName.trim()) {
            newErrors.universityName = 'University name is required';
        }

        if (!formData.branch.trim()) {
            newErrors.branch = 'Branch is required';
        }

        if (showTeamField && !formData.teamName.trim()) {
            newErrors.teamName = 'Team name is required';
        }

        if (!formData.mobileNo.trim()) {
            newErrors.mobileNo = 'Mobile number is required';
        } else if (!/^[6-9]\d{9}$/.test(formData.mobileNo)) {
            newErrors.mobileNo = 'Enter a valid 10 digit mobile number';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Enter a valid email address';
        }

        if (!formData.aadharNo.trim()) {
            newErrors.aadharNo = 'Aadhar number is required';
        } else if (!/^\d{12}$/.test(formData.aadharNo)) {
            newErrors.aadharNo = 'Aadhar number must be 12 digits';
        }

        if (!formData.aadharPhoto) {
            newErrors.aadharPhoto = 'Please upload Aadhar card photo';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const submissionData = {
                ...formData,
                sportCategory: selectedSport.category,
                sportCategoryId: selectedSport.categoryId,
                sportName: selectedSport.name,
                sportId: selectedSport.id,
                sportType: selectedSport.type,
                teamSize: selectedSport.teamSize,
            };
            onSubmit(submissionData);
        }
    };

    if (!selectedSport) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                <p>Please select a sport from above to continue with registration</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <h3 style={{ marginBottom: '20px' }}>
                Registration Form - {selectedSport.name} ({getSportTypeLabel(selectedSport.type)})
            </h3>

            <FormInput
                label={showTeamField ? "Team Captain Name" : "Participant Name"}
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder={showTeamField ? "Enter captain's name" : "Enter your name"}
                required
                error={errors.name}
                maxLength={50}
            />

            {showTeamField && (
                <FormInput
                    label="Team Name"
                    name="teamName"
                    type="text"
                    value={formData.teamName}
                    onChange={handleChange}
                    placeholder="Enter team name"
                    required
                    error={errors.teamName}
                    maxLength={50}
                />
            )}

            <FormInput
                label="University / College Name"
                name="universityName"
                type="text"
                value={formData.universityName}
                onChange={handleChange}
                placeholder="Enter university or college name"
                required
                error={errors.universityName}
                maxLength={100}
            />

            <FormInput
                label="Branch / Department"
                name="branch"
                type="text"
                value={formData.branch}
                onChange={handleChange}
                placeholder="e.g., CSE, ECE, Mechanical"
                required
                error={errors.branch}
                maxLength={50}
            />

            <FormInput
                label="Mobile Number"
                name="mobileNo"
                type="tel"
                value={formData.mobileNo}
                onChange={handleChange}
                placeholder="10 digit mobile number"
                required
                error={errors.mobileNo}
                maxLength={10}
                helpText="Preferably WhatsApp number"
            />

            <FormInput
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
                error={errors.email}
                maxLength={100}
            />

            <FormInput
                label="Aadhar Card Number"
                name="aadharNo"
                type="text"
                value={formData.aadharNo}
                onChange={handleChange}
                placeholder="12 digit Aadhar number"
                required
                error={errors.aadharNo}
                maxLength={12}
                helpText={showTeamField ? "Captain's Aadhar number" : "Your Aadhar number"}
            />

            <FileUpload
                label={showTeamField ? "Captain's Aadhar Card Photo" : "Aadhar Card Photo"}
                name="aadharPhoto"
                onChange={handleChange}
                required
                error={errors.aadharPhoto}
            />

            <button type="submit" disabled={isLoading} style={{ padding: '10px 20px', marginTop: '10px' }}>
                {isLoading ? 'Processing...' : `Pay ₹${selectedSport.fee} & Register`}
            </button>

            {showTeamField && (
                <p style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
                    Note: Team consists of {selectedSport.teamSize} players. Only captain's details are required now.
                </p>
            )}
        </form>
    );
};

export default RegistrationForm;

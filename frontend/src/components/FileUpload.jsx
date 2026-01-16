// FileUpload - Aadhar photo upload component with preview and validation
import { useState, useRef } from 'react';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const FileUpload = ({ label, name, onChange, required = false, error }) => {
    const [preview, setPreview] = useState(null);
    const [localError, setLocalError] = useState('');
    const fileInputRef = useRef(null);

    const validateFile = (file) => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            return 'Only JPG, PNG, or WEBP images are allowed';
        }
        if (file.size > MAX_FILE_SIZE) {
            return 'File size must be less than 2MB';
        }
        return null;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validationError = validateFile(file);
        if (validationError) {
            setLocalError(validationError);
            return;
        }

        setLocalError('');
        setPreview(URL.createObjectURL(file));
        onChange({ target: { name, files: [file] } });
    };

    const handleRemove = () => {
        setPreview(null);
        setLocalError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        onChange({ target: { name, files: [] } });
    };

    const displayError = error || localError;

    return (
        <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: 'rgba(255, 255, 255, 0.9)' }}>
                {label}
                {required && <span style={{ color: '#ff6b6b' }}> *</span>}
            </label>

            {!preview ? (
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        name={name}
                        accept={ALLOWED_TYPES.join(',')}
                        onChange={handleFileChange}
                    />
                    <small style={{ display: 'block', marginTop: '4px', color: '#666' }}>
                        JPG, PNG, WEBP (Max 2MB)
                    </small>
                </div>
            ) : (
                <div>
                    <img src={preview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '150px', display: 'block', marginBottom: '10px' }} />
                    <button type="button" onClick={handleRemove}>Remove</button>
                </div>
            )}

            {displayError && (
                <small style={{ color: 'red', display: 'block', marginTop: '4px' }}>{displayError}</small>
            )}
        </div>
    );
};

export default FileUpload;

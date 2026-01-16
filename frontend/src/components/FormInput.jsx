// FormInput - Reusable input field component with label, validation, and help text
import { useState } from 'react';

const FormInput = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false,
    error,
    maxLength,
    helpText,
}) => {
    return (
        <div style={{ marginBottom: '15px' }}>
            <label htmlFor={name} style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: 'rgba(255, 255, 255, 0.9)' }}>
                {label}
                {required && <span style={{ color: '#ff6b6b' }}> *</span>}
            </label>

            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                maxLength={maxLength}
                style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: error ? '2px solid #ff6b6b' : '2px solid rgba(255, 150, 55, 0.35)',
                    borderRadius: '10px',
                    fontSize: '15px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    transition: 'all 0.3s ease'
                }}
            />

            {helpText && !error && (
                <small style={{ color: 'rgba(255, 255, 255, 0.6)', display: 'block', marginTop: '4px' }}>{helpText}</small>
            )}

            {error && (
                <small style={{ color: '#ff6b6b', display: 'block', marginTop: '4px' }}>{error}</small>
            )}
        </div>
    );
};

export default FormInput;

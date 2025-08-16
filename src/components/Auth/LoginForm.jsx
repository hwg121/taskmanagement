import React, { useState, useRef, useEffect } from 'react';
import ErrorMessage from '../Commons/ErrorMessage';
import LoadingSpinner from '../Commons/LoadingSpinner';
import '../../Styles/FormLogin.css';

function LoginForm({ onLogin }) {
    // State cho form data và loading
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    // State cho validation errors
    const [errors, setErrors] = useState({});

    // State cho form submission error
    const [submitError, setSubmitError] = useState('');

    // Refs cho focus management
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);

    // Focus vào username khi component mount
    useEffect(() => {
        if (usernameRef.current) {
            usernameRef.current.focus();
        }
    }, []);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error khi user bắt đầu gõ
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Clear submit error

        if (submitError) {
            setSubmitError('');
        }
    };

    // Validation function
    const validateForm = () => {
        const newErrors = {};

        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = 'Username là bắt buộc';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username phải có ít nhất 3 ký tự';
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            newErrors.username = 'Username chỉ được chứa chữ cái, số và dấu gạch dưới';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password là bắt buộc';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password phải có ít nhất 6 ký tự';
        } else if (!/^[a-zA-Z0-9!@#$%^&*]+$/.test(formData.password)) {
            newErrors.password = 'Password chỉ được chứa chữ cái, số và các ký tự đặc biệt (!@#$%^&*)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            await onLogin(formData);
        } catch (error) {
            console.error('Login error:', error);
            setSubmitError(error.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
            // Focus vào field đầu tiên có lỗi
            if (usernameRef.current) {
                usernameRef.current.focus();
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Handle retry từ ErrorMessage
    const handleRetry = async () => {
        setSubmitError('');
        if (formData.username && formData.password) {
            handleSubmit(new Event('submit'));
        } else if (usernameRef.current) {
            usernameRef.current.focus();
        }
    };

    // Handle dismiss error
    const handleDismissError = () => {
        setSubmitError('');
    };

    // Cleanup effect
    useEffect(() => {
        return () => {
            setSubmitError('');
            setErrors({});
        };
    }, []);

    return (
        <div className="login-form-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="login-title">Đăng nhập</h2>

                {/* Submit Error Display */}
                {submitError && (
                    <ErrorMessage
                        message={submitError}
                        onRetry={handleRetry}
                        onDismiss={handleDismissError}
                    />
                )}

                {/* Username Field */}
                <div className="form-field">
                    <label htmlFor="username" className="form-label">
                        Username *
                    </label>
                    <input
                        ref={usernameRef}
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className={`form-input ${errors.username ? 'form-input--error' : ''}`}
                        placeholder="Nhập username của bạn"
                        disabled={isLoading}
                    />
                    {errors.username && (
                        <span className="form-error">{errors.username}</span>
                    )}
                </div>

                {/* Password Field */}
                <div className="form-field">
                    <label htmlFor="password" className="form-label">
                        Password *
                    </label>
                    <input
                        ref={passwordRef}
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`form-input ${errors.password ? 'form-input--error' : ''}`}
                        placeholder="Nhập password của bạn"
                        disabled={isLoading}
                    />
                    {errors.password && (
                        <span className="form-error">{errors.password}</span>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="submit-btn"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <LoadingSpinner size="small" />
                            <span>Đang đăng nhập...</span>
                        </>
                    ) : (
                        'Đăng nhập'
                    )}
                </button>
            </form>
        </div>
    );
}

export default LoginForm;
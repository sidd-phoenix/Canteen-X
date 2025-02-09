import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { MdEmail, MdPhone, MdEdit } from 'react-icons/md';
import Image from 'next/image';
import '@/styles/UserProfile.css';

const UserProfile = () => {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        role: '',
    });
    const [editForm, setEditForm] = useState({
        phoneNumber: '',
    });
    const [notification, setNotification] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (session) {
                try {
                    const response = await fetch(`/api/user/${session.user.email}`);
                    const data = await response.json();
                    if (data.success) {
                        setUserDetails(data.user);
                        setEditForm({ phoneNumber: data.user.phoneNumber || '' });
                    } else {
                        setError(data.message || 'Failed to fetch user details.');
                    }
                } catch (error) {
                    console.error('Error fetching user details:', error);
                    setError('An error occurred while fetching user details.');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserDetails();
    }, [session]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditForm({ phoneNumber: userDetails.phoneNumber });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`/api/user/${session.user.email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber: editForm.phoneNumber }),
            });
            const data = await response.json();
            if (data.success) {
                setUserDetails((prev) => ({
                    ...prev,
                    phoneNumber: editForm.phoneNumber,
                }));
                setNotification('Phone number updated successfully!');
                setIsEditing(false);
            } else {
                setNotification(data.message || 'Failed to update phone number.');
            }
        } catch (error) {
            console.error('Error updating user details:', error);
            setNotification('An error occurred while updating your details.');
        }
    };

    if (loading) {
        return <UserProfileSkeleton />
    }

    if (error) {
        return <div className="error">{error}</div>; // Display error message
    }

    return (
        <div className="user-profile-page">
            {notification && <div className="notification">{notification}</div>}
            <div className="user-profile">
                <div className="profile-header">
                    <div className="profile-image-container">
                        <Image
                            src={session?.user?.image || '/default-profile.png'}
                            alt="Profile"
                            width={150}
                            height={150}
                            className="profile-image"
                        />
                    </div>
                    <div className="profile-info">
                        <h2>{userDetails.name}</h2>
                        <div className="profile-email">
                            <MdEmail />
                            {userDetails.email}
                        </div>
                    </div>
                </div>

                <div className="profile-details">
                    {isEditing ? (
                        <div className="edit-form">
                            <div className="detail-group">
                                <label htmlFor="phoneNumber">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={editForm.phoneNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="detail-group">
                                <label>Role</label>
                                <span>{userDetails.role}</span>
                            </div>
                            <div className="detail-group">
                                <label>Phone Number</label>
                                <span className="profile-phone">
                                    <MdPhone />
                                    {userDetails.phoneNumber}
                                </span>
                            </div>
                        </>
                    )}
                </div>

                <div className="profile-actions">
                    {isEditing ? (
                        <>
                            <button className="profile-button save-button" onClick={handleSave}>
                                Save Changes
                            </button>
                            <button className="profile-button cancel-button" onClick={handleCancel}>
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button className="profile-button edit-button" onClick={handleEdit}>
                            <MdEdit /> Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const UserProfileSkeleton = () => (
    <div className="user-profile skeleton">
        <div className="profile-header">
            <div className="profile-image-container">
                <div className="skeleton-image pulse"></div>
            </div>
            <div className="profile-info">
                <div className="skeleton-text-lg pulse"></div>
                <div className="skeleton-text-sm pulse"></div>
            </div>
        </div>
        <div className="profile-details">
            <div className="detail-group">
                <div className="skeleton-text-md pulse"></div>
                <div className="skeleton-text-sm pulse"></div>
            </div>
            <div className="detail-group">
                <div className="skeleton-text-md pulse"></div>
                <div className="skeleton-text-sm pulse"></div>
            </div>
        </div>
    </div>
);

export default UserProfile;
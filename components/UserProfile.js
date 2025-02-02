import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { MdEmail, MdPhone, MdEdit, MdLogout} from 'react-icons/md';
import Image from 'next/image';
import '@/styles/UserProfile.css';

const UserProfile = () => {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        phone: '',
        role: '',
    });
    const [editForm, setEditForm] = useState({
        name: '',
        phone: '',
    });

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (session?.user?.email) {
                try {
                    const response = await fetch(`/api/user/${session.user.email}`);
                    const data = await response.json();
                    if (data.success) {
                        setUserDetails({
                            ...data.user,
                            name: session.user.name,
                            email: session.user.email,
                            profileImage: session.user.image
                        });
                    }
                } catch (error) {
                    console.error('Error fetching user details:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        if (session) {
            fetchUserDetails();
        }
    }, [session]);

    const handleEdit = () => {
        setEditForm({
            name: userDetails.name,
            phone: userDetails.phone,
        });
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`/api/user/${session.user.email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editForm),
            });
            const data = await response.json();
            if (data.success) {
                setUserDetails(prev => ({
                    ...prev,
                    ...data.user
                }));
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error updating user details:', error);
        }
    };

    if (loading) {
        return <UserProfileSkeleton />;
    }

    return (
        <div className="user-profile-page">
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
                        <h2>{session?.user?.name}</h2>
                        <div className="profile-email">
                            <MdEmail />
                            {session?.user?.email}
                        </div>
                    </div>
                </div>

                <div className="profile-details">
                    {isEditing ? (
                        <div className="edit-form">
                            <div className="detail-group">
                                <label>Phone</label>
                                <input
                                    type="tel"
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="detail-group">
                                <label>Role</label>
                                <span>{session?.user.role}</span>
                            </div>
                            <div className="detail-group">
                                <label>Phone</label>
                                <span className="profile-phone">
                                    <MdPhone />
                                    {userDetails.phone}
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
                            <button className="profile-button cancel-button" onClick={() => setIsEditing(false)}>
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="profile-button edit-button" onClick={handleEdit}>
                                <MdEdit /> Edit Profile
                            </button>
                            <button className="profile-button logout-button" onClick={() => signOut()}>
                                <MdLogout /> Logout
                            </button>
                        </>
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
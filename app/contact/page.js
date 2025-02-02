import React from 'react';

const ContactUs = () => {
    return (
        <div>
            <h1>Contact Us</h1>
            <p>If you have any questions, feel free to reach out to us!</p>
            <form>
                <label>Name:</label>
                <input type="text" required />
                <label>Email:</label>
                <input type="email" required />
                <label>Message:</label>
                <textarea required></textarea>
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default ContactUs; 
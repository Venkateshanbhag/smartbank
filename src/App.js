""/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [uniqueId, setUniqueId] = useState('');
    const [amount, setAmount] = useState('');
    const [balance, setBalance] = useState(null);
    const [message, setMessage] = useState('');
    const [mode, setMode] = useState(''); // 'create' or 'update'

    useEffect(() => {
        setUsername('');
        setEmail('');
        setUniqueId('');
        setAmount('');
        setBalance(null);
        setMessage('');
    }, [mode]);

    const createAccount = () => {
        if (!username || !email || !amount) {
            alert("Please fill in all fields");
            return;
        }

        if (!validateEmail(email)) {
            alert("Please enter a valid email address");
            return;
        }

        axios.post('http://localhost:5000/create_account', {
            username,
            email,
            amount: parseInt(amount)
        })
        .then(response => {
            alert(response.data.message);
            setUsername('');
            setEmail('');
            setAmount('');
            setMessage("Account created successfully! Check your email for your login ID.");
        })
        .catch(error => alert(error.response?.data?.message || 'Error creating account'));
    };

    const updateAccount = async (action) => {
        if (!uniqueId) {
            alert("Please enter your unique ID");
            return;
        }

        if (!amount || parseInt(amount) <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        axios.post('http://localhost:5000/update_balance', {
            unique_id: uniqueId,
            action,
            amount: parseInt(amount)
        })
        .then(response => {
            alert(response.data.message);
            fetchBalance(); // Auto-update balance after deposit/withdraw
        })
        .catch(error => alert(error.response?.data?.message || 'Error updating account'));
    };

    const fetchBalance = () => {
        if (!uniqueId) {
            alert("Please enter your unique ID");
            return;
        }

        axios.post('http://localhost:5000/get_balance', { unique_id: uniqueId })
        .then(response => {
            setBalance(response.data.balance);
        })
        .catch(error => alert(error.response?.data?.message || 'Error fetching balance'));
    };

    const deleteAccount = () => {
        if (!uniqueId) {
            alert("Please enter your unique ID");
            return;
        }

        if (window.confirm("Are you sure you want to delete this account? This action cannot be undone.")) {
            axios.post('http://localhost:5000/delete_account', { unique_id: uniqueId })
            .then(response => {
                alert(response.data.message);
                setBalance(null);
                setUniqueId('');
            })
            .catch(error => alert(error.response?.data?.message || 'Error deleting account'));
        }
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    return (
        <div className="container">
            <h1 className="title">💳 Smart Banking System</h1>
            <div className="mode-selection">
                <button className={`mode-btn ${mode === 'create' ? 'active' : ''}`} onClick={() => setMode('create')}>➕ Create Account</button>
                <button className={`mode-btn ${mode === 'update' ? 'active' : ''}`} onClick={() => setMode('update')}>🔄 Update Account</button>
            </div>

            {mode === 'create' && (
                <div className="box create-box">
                    <h2>🎉 Open New Account</h2>
                    <input type="text" className="input-field" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input type="email" className="input-field" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="number" className="input-field" placeholder="Initial Deposit" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    <button className="action-btn create-btn" onClick={createAccount}>Create Account</button>
                </div>
            )}

            {mode === 'update' && (
                <div className="box update-box">
                    <h2>⚙️ Manage Your Account</h2>
                    <input type="text" className="input-field" placeholder="Unique ID (check your email)" value={uniqueId} onChange={(e) => setUniqueId(e.target.value)} />
                    <input type="number" className="input-field" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    <div className="button-group">
                        <button className="action-btn deposit-btn" onClick={() => updateAccount('deposit')}>💰 Deposit</button>
                        <button className="action-btn withdraw-btn" onClick={() => updateAccount('withdraw')}>💸 Withdraw</button>
                        <button className="action-btn delete-btn" onClick={deleteAccount}>🗑️ Delete</button>
                    </div>
                    <button className="action-btn balance-btn" onClick={fetchBalance}>📊 Check Balance</button>
                </div>
            )}

            {balance !== null && (
                <div className="balance-display">
                    <h3>Your Current Balance: <span className="balance">₹{balance}</span></h3>
                </div>
            )}

            {message && <p className="message-box">{message}</p>}
        </div>
    );
}

export default App;

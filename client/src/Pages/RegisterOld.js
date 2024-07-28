import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import './Login.css';
import { v4 as uuidv4 } from 'uuid';


const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [passwordValidations, setPasswordValidations] = useState({
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
    });

    const createUser = async () => {
        const userId = uuidv4();
        const options = {
            method: 'POST',
            url: 'https://api.circle.com/v1/w3s/users',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer TEST_API_KEY:a4f681a3a29bf1bed4003bea2d356275:fd0cffd466303adf845a78b873ec67af`,
            },
            body: JSON.stringify({ userId: userId }),
        };
    
        try {
            const response = await fetch(options.url, {
                method: options.method,
                headers: options.headers,
                body: options.body,
            });
            const data = await response.json();
            console.log('createUser response:', data); // Eklendi
            return { userId: data.data.id };
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const acquireSessionToken = async (userId) => {
        console.log('acquireSessionToken userId:', userId); // Eklendi
        const options = {
            method: 'POST',
            url: 'https://api.circle.com/v1/w3s/users/token',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer TEST_API_KEY:a4f681a3a29bf1bed4003bea2d356275:fd0cffd466303adf845a78b873ec67af`,
            },
            body: JSON.stringify({ userId: userId }),
        };
    
        try {
            const response = await fetch(options.url, {
                method: options.method,
                headers: options.headers,
                body: options.body,
            });
            const data = await response.json();
            console.log('acquireSessionToken response:', data); // Eklendi
            return {
                encryptionKey: data.data.encryptionKey,
                userToken: data.data.userToken,
            };
        } catch (error) {
            console.error('Error acquiring session token:', error);
        }
    };

    const initializeUser = async (userToken) => {
        const idempotencyKey = uuidv4();
        const options = {
            method: 'POST',
            url: 'https://api.circle.com/v1/w3s/user/initialize',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer TEST_API_KEY:a4f681a3a29bf1bed4003bea2d356275:fd0cffd466303adf845a78b873ec67af`,
                'X-User-Token': userToken,
            },
            body: JSON.stringify({ idempotencyKey: idempotencyKey, blockchains: ['MATIC-AMOY'] }),
        };

        try {
            const response = await fetch(options.url, {
                method: options.method,
                headers: options.headers,
                body: options.body,
            });
            const data = await response.json();
            return data.data.challengeId;
        } catch (error) {
            console.error('Error initializing user:', error);
        }
    };

    async function register(ev) {
        ev.preventDefault();
        if (password !== confirmPassword) {
            alert('Şifreler birbiriyle eşleşmiyor!');
            return;
        }
        if (!passwordValidations.minLength || !passwordValidations.hasUppercase || !passwordValidations.hasLowercase || !passwordValidations.hasNumber) {
            alert('Lütfen şifrenizi kontrol edin!');
            return;
        }

        try {
            const newUser = await createUser();
            const sessionData = await acquireSessionToken(newUser.userId);
            const challengeId = await initializeUser(sessionData.userToken, sessionData.encryptionKey);

            const response = await fetch('http://localhost:3030/register', {
                method: 'POST',
                body: JSON.stringify({
                    email,
                    username,
                    password,
                    userId: newUser.userId,
                    userToken: sessionData.userToken,
                    encryptionKey: sessionData.encryptionKey,
                    challengeId: challengeId,
                }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                alert('Kayıt Başarılı!');
                setRedirect(true);
            } else {
                alert('Kayıt olurken hata oluştu! Lütfen tekrar deneyin.');
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    }

    const validatePassword = (value) => {
        const validations = {
            minLength: value.length >= 8,
            hasUppercase: /[A-Z]/.test(value),
            hasLowercase: /[a-z]/.test(value),
            hasNumber: /\d/.test(value),
        };
        setPasswordValidations(validations);
    };

    const handleChangePassword = (ev) => {
        const value = ev.target.value;
        setPassword(value);
        validatePassword(value);
    };

    if (redirect) {
        return <Navigate to="/login" />;
    }

    return (
        <div className='loginArea'>
            <form className="login" onSubmit={register}>
                <h1>Kayıt Ol</h1>
                <input type="email"
                    placeholder="email"
                    value={email}
                    required
                    onChange={ev => setEmail(ev.target.value)} />
                <input type="text"
                    placeholder="username"
                    value={username}
                    minLength={5}
                    maxLength={16}
                    required
                    onChange={ev => setUsername(ev.target.value)} />
                <input type="password"
                    placeholder="password"
                    value={password}
                    minLength={8}
                    required
                    autoComplete="off"
                    onChange={handleChangePassword} />
                {password !== '' &&
                    <ul className="password-validations">
                        {!passwordValidations.minLength && <li>Minimum 8 karakter olmalı</li>}
                        {!passwordValidations.hasUppercase && <li>Minimum bir büyük harf içermeli</li>}
                        {!passwordValidations.hasLowercase && <li>Minimum bir küçük harf içermeli</li>}
                        {!passwordValidations.hasNumber && <li>Minimum bir numara içermeli</li>}
                    </ul>
                }
                <input type="password"
                    placeholder="confirm password"
                    value={confirmPassword}
                    required
                    onChange={ev => setConfirmPassword(ev.target.value)} />
                {confirmPassword !== '' && password !== confirmPassword && <div className="password-validations">Şifreler eşleşmiyor!</div>}
                <button>Kayıt Ol</button>
                <div className='newAccount'>Zaten bir hesabın var mı? <Link to="/login">Giriş Yap</Link></div>
            </form>
        </div>
    );
};

export default RegisterPage;

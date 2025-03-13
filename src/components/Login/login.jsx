// Project Components and Dependencies
import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import TransitionLoader from '../Others/TransitionLoader.jsx';

// Project Configuration
import { API_URL } from '../../constants/config';

// Styles
import './login.css';
function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Handles the login submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            toast.error('Preencha todos os campos');
            return;
        }
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_URL}/login`, { username, password });
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                toast.success('Login realizado com sucesso!');
                window.location.href = '/dashboard';
            } else if (response.status === 401) {
                toast.error('Usuário ou senha incorretos');
            } else {
                toast.error('Erro ao realizar login');
            }
        } catch (err) {
            toast.error('Erro ao realizar login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='login'>
            <ToastContainer /> 
            {isLoading ? (
                <TransitionLoader loaderType={'puff'} navbar={false} message={'Carregando...'} />
            ) : (
                <div className="login-container">
                    <div className="login-header">
                        <Lock size={40} style={{ color: '#75492c', marginBottom: '1rem' }} />
                        <h1>ENTRAR NO DASHBOARD</h1>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="input-form-group">
                            <label htmlFor="username">Usuário</label>
                            <div className="login-input-wrapper">
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Digite seu usuário"
                                    disabled={isLoading}
                                />
                                <User size={20} />
                            </div>
                        </div>
                        <div className="input-form-group">
                            <label htmlFor="password">Senha</label>
                            <div className="login-input-wrapper">
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Digite sua senha"
                                    disabled={isLoading}
                                />
                                <Lock size={20} />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="login-button"
                            disabled={isLoading}
                        >
                            Entrar
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Login;
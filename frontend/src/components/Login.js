import React, { useState } from 'react';
import { useAuth } from '../services/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError('Erro interno. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">ProCultura RS</h1>
        <p className="text-center text-muted mb-4">
          Sistema de Consulta Cultural do Rio Grande do Sul
        </p>
        
        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div>
            <label htmlFor="email" className="form-label">E-mail</label>
            <input
              type="email"
              id="email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="form-label">Senha</label>
            <input
              type="password"
              id="password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              required
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-4 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
          <small className="text-muted">
            <strong>Credenciais de demonstração:</strong><br />
            E-mail: admin@procultura.rs.gov.br<br />
            Senha: admin123
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;

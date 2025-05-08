import React, { useState } from 'react';
import * as Form from '@radix-ui/react-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Form validation
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = 'Email est requis';
    if (!password) newErrors.password = 'Mot de passe est requis';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Clear previous errors
    setErrors({});
    
    try {
      await login(email, password);
      navigate('/'); 
    } catch (error) {
      console.error('Erreur de connexion:', error);
      
      if ((error as any).statusCode === 401) {
        setErrors({ form: 'Email ou mot de passe incorrect' });
      } else {
        setErrors({ form: (error as Error).message || 'Échec de la connexion. Veuillez réessayer.' });
      }
    }
  };

  return (
    <Form.Root className="space-y-6" onSubmit={handleSubmit}>
      {errors.form && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{errors.form}</div>
        </div>
      )}
      
      <Form.Field name="email" className="space-y-1">
        <Form.Label className="block text-sm font-medium text-gray-700">
          Email
        </Form.Label>
        <Form.Control asChild>
          <input
            type="email"
            name="email"
            className={`block w-full appearance-none rounded-md border ${errors.email ? 'border-red-300' : 'border-gray-300'} px-3 py-2 placeholder-gray-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm`}
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Control>
        {errors.email && (
          <p className="text-xs text-red-600">{errors.email}</p>
        )}
      </Form.Field>
      
      <Form.Field name="password" className="space-y-1">
        <Form.Label className="block text-sm font-medium text-gray-700">
          Mot de passe
        </Form.Label>
        <Form.Control asChild>
          <input
            type="password"
            name="password"
            className={`block w-full appearance-none rounded-md border ${errors.password ? 'border-red-300' : 'border-gray-300'} px-3 py-2 placeholder-gray-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm`}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Control>
        {errors.password && (
          <p className="text-xs text-red-600">{errors.password}</p>
        )}
      </Form.Field>
      
      <div className="flex items-center justify-between">
        <Form.Field name="remember" className="flex items-center">
          <Form.Control asChild>
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
          </Form.Control>
          <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
            Se souvenir de moi
          </label>
        </Form.Field>
      </div>
      
      <Form.Submit asChild>
        <button
          type="submit"
          className="flex w-full justify-center items-center rounded-md border border-transparent bg-gradient-to-r from-teal-500 to-teal-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-70"
          disabled={isLoading}
        >
          {isLoading && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {isLoading ? 'Connexion...' : 'Se connecter'}
        </button>
      </Form.Submit>
    </Form.Root>
  );
};

export default LoginForm;
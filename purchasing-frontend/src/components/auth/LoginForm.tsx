import React, { useState, useEffect } from 'react';
import * as Form from '@radix-ui/react-form';
import { useAuth } from '../../hooks/useAuth';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string>('');
  const [remember, setRemember] = useState(false); // Add this
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error: authError, isLoading: authIsLoading } = useAuth();

  // Pour les erreurs local ou de connexion
  const displayError = localError || (authError === 'Invalid credentials.' ? 'Email ou mot de passe incorrect' : authError);

  useEffect(() => {
    if (authError) {
      setLocalError('');
    }
  }, [authError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    setLocalError('');
    
    if (!email) {
      setLocalError('Email est requis');
      return;
    }
    if (!password) {
      setLocalError('Mot de passe est requis');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // prise en compte de souvenir de moi
      await login(email, password, remember);
    } catch (error) {
      // Si erreur, afficher l'erreur
      setIsSubmitting(false);
    }
  };

  const formIsLoading = isSubmitting || authIsLoading;

  return (
    <Form.Root className="space-y-6" onSubmit={handleSubmit}>
      {displayError && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">
            {displayError}
          </div>
        </div>
      )}
      
      <Form.Field name="email">
        <div className="space-y-1">
          <Form.Label className="block text-sm font-medium text-gray-700">
            Email
          </Form.Label>
          <Form.Control asChild>
            <input
              type="email"
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={formIsLoading}
            />
          </Form.Control>
          <Form.Message match="valueMissing">
            <p className="text-xs text-red-600">Email est requis</p>
          </Form.Message>
          <Form.Message match="typeMismatch">
            <p className="text-xs text-red-600">Email invalide</p>
          </Form.Message>
        </div>
      </Form.Field>
      
      <Form.Field name="password">
        <div className="space-y-1">
          <Form.Label className="block text-sm font-medium text-gray-700">
            Mot de passe
          </Form.Label>
          <Form.Control asChild>
            <input
              type="password"
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={formIsLoading}
            />
          </Form.Control>
          <Form.Message match="valueMissing">
            <p className="text-xs text-red-600">Mot de passe est requis</p>
          </Form.Message>
        </div>
      </Form.Field>
      
      <div className="flex items-center justify-between">
        <Form.Field name="remember" className="flex items-center">
          <Form.Control asChild>
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              disabled={formIsLoading}
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
          </Form.Control>
        <label className="ml-2 block text-sm text-gray-700">
          Se souvenir de moi
        </label>
      </Form.Field>
    </div>
      
    <Form.Submit asChild>
      <button
        type="submit"
        className="flex w-full justify-center items-center rounded-md border border-transparent bg-gradient-to-r from-teal-500 to-teal-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-70"
        disabled={formIsLoading}
      >
        {formIsLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {formIsLoading ? 'Connexion...' : 'Se connecter'}
      </button>
    </Form.Submit>
  </Form.Root>
  );
};

export default LoginForm;
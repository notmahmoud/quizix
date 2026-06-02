import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setAuthError('');
      setIsLoading(true);
      await signup(data.email, data.password, data.name);
      navigate('/dashboard');
    } catch (error) {
      setAuthError(error.message || 'Failed to create an account.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setAuthError('');
      setIsLoading(true);
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      setAuthError('Failed to sign in with Google.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#FAF9F7' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card w-full"
        style={{ maxWidth: 420, padding: '2.5rem' }}
      >
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <div style={{ background: '#0D9488', padding: '6px', borderRadius: 8 }}>
              <Sparkles style={{ width: 18, height: 18, color: '#fff' }} />
            </div>
            <span style={{ fontWeight: 600, color: '#111827', fontSize: '1rem' }}>Quizix</span>
          </Link>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 500, color: '#111827', marginBottom: '0.25rem' }}>Create an account</h1>
          <p style={{ fontSize: '0.875rem', color: '#4B5563' }}>Join Quizix to start hosting real-time quizzes</p>
        </div>

        {authError && (
          <div className="mb-5 p-3 rounded-lg flex items-start gap-2 text-sm" style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#EF4444' }}>
            <AlertCircle style={{ width: 15, height: 15, marginTop: 1, flexShrink: 0 }} />
            <p>{authError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: 6 }}>Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User style={{ height: 16, width: 16, color: '#9CA3AF' }} />
              </div>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Your full name"
              />
            </div>
            {errors.name && <p style={{ color: '#EF4444', fontSize: '0.8125rem', marginTop: 4 }}>{errors.name.message}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: 6 }}>Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail style={{ height: 16, width: 16, color: '#9CA3AF' }} />
              </div>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p style={{ color: '#EF4444', fontSize: '0.8125rem', marginTop: 4 }}>{errors.email.message}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: 6 }}>Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock style={{ height: 16, width: 16, color: '#9CA3AF' }} />
              </div>
              <input
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="At least 6 characters"
              />
            </div>
            {errors.password && <p style={{ color: '#EF4444', fontSize: '0.8125rem', marginTop: 4 }}>{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full justify-center"
            style={{ height: 44, fontSize: '0.9375rem' }}
          >
            {isLoading ? <Loader2 style={{ width: 18, height: 18 }} className="animate-spin" /> : 'Create account'}
          </button>
        </form>

        <div className="mt-6 flex items-center gap-3">
          <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
          <span className="section-label">Or continue with</span>
          <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="btn-secondary w-full justify-center gap-2 mt-4"
          style={{ height: 44 }}
        >
          <svg style={{ width: 18, height: 18 }} viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>

        <p className="mt-6 text-center" style={{ fontSize: '0.875rem', color: '#4B5563' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#0D9488', fontWeight: 500 }}>Log in</Link>
        </p>
      </motion.div>
    </div>
  );
}

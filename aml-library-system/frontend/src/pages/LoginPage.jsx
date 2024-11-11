import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Card, CardHeader } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      if (isRegistering) {
        // NOT DONE!!!!
        await createUserWithEmailAndPassword(auth, email, password);
        console.log('Registration successful');
      } else {
        // Login user
        await signInWithEmailAndPassword(auth, email, password);
        console.log('Login successful');
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Full error object:', err);
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);

      switch (err.code) {
        case 'auth/user-not-found':
          setError('No account found with this email');
          break;
        case 'auth/wrong-password':
          setError('Invalid password');
          break;
        case 'auth/invalid-email':
          setError('Invalid email format');
          break;
        case 'auth/email-already-in-use':
          setError('Email already registered');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters');
          break;
        case 'auth/invalid-credential':
          setError('Invalid email or password');
          break;
        default:
          setError(`Authentication error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card>
        <CardHeader 
          title={isRegistering ? "Register" : "Login"} 
          description={isRegistering 
            ? "Create a new account to access the library system." 
            : "Enter your email and password to access your account."} 
        />
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
            <Input
              id="password"
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
            {error && (
              <Alert variant="error">
                {error}
              </Alert>
            )}
          </div>
          <div className="mt-6 space-y-4">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Processing...' : (isRegistering ? 'Register' : 'Sign In')}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setIsRegistering(!isRegistering)}
              disabled={loading}
              className="w-full"
            >
              {isRegistering 
                ? 'Already have an account? Sign In' 
                : 'Need an account? Register'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
} 
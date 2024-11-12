import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Card, CardHeader } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    street_address: '',
    city: '',
    postal_code: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );

      console.log('Firebase user created:', userCredential.user.uid);

      try {
        // Create user in your database
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firebase_uid: userCredential.user.uid,
            role: 'member',
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            street_address: formData.street_address || null,
            city: formData.city || null,
            postal_code: formData.postal_code || null,
            notifications_enabled: true,
            outstanding_fines: 0
          }),
        });

        if (!response.ok) {
          // This will delete the user from firebase if the database creation fails
          await userCredential.user.delete();
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create user profile');
        }

        console.log('Registration successful');
        navigate('/dashboard');
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Clean up Firebase user if database creation fails
        await userCredential.user.delete();
        throw new Error('Failed to create user profile in database');
      }
    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please try logging in instead.');
      } else if (err.code) {
        // Other Firebase Auth errors
        switch (err.code) {
          case 'auth/invalid-email':
            setError('Invalid email format');
            break;
          case 'auth/weak-password':
            setError('Password should be at least 6 characters');
            break;
          default:
            setError(`Authentication error: ${err.message}`);
        }
      } else if (err.message === 'Failed to fetch') {
        setError('Unable to connect to the server. Please try again later.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader 
          title="Welcome to AML Library" 
          description="Create an account to start your reading journey."
          className="text-center"
        />
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-4">
            {/* Required Fields */}
            <Input
              id="email"
              type="email"
              label="Email *"
              placeholder="m@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
              autoComplete="email"
            />
            <Input
              id="password"
              type="password"
              label="Password *"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
              autoComplete="new-password"
            />
            <Input
              id="confirmPassword"
              type="password"
              label="Confirm Password *"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              required
              autoComplete="new-password"
            />
            <Input
              id="name"
              type="text"
              label="Full Name *"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              required
              autoComplete="name"
            />

            {/* Optional Fields */}
            <Input
              id="phone"
              type="tel"
              label="Phone Number"
              placeholder="07700 900000"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
              autoComplete="tel"
            />
            <Input
              id="street_address"
              type="text"
              label="Street Address"
              placeholder="42 High Street"
              value={formData.street_address}
              onChange={handleChange}
              disabled={loading}
              autoComplete="street-address"
            />
            <Input
              id="city"
              type="text"
              label="City"
              placeholder="Manchester"
              value={formData.city}
              onChange={handleChange}
              disabled={loading}
              autoComplete="address-level2"
            />
            <Input
              id="postal_code"
              type="text"
              label="Postal Code"
              placeholder="M1 1AA"
              value={formData.postal_code}
              onChange={handleChange}
              disabled={loading}
              autoComplete="postal-code"
            />

            {error && (
              <Alert variant="error">
                {error}
              </Alert>
            )}
          </div>
          <div className="space-y-4">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Registering...' : 'Register'}
            </Button>
            <div className="text-center">
              <span>Already have an account? </span>
              <Link to="/" className="text-blue-500 hover:underline">
                Sign In
              </Link>
            </div>
            <div className="text-center text-sm text-gray-500">
              * Required fields
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
} 
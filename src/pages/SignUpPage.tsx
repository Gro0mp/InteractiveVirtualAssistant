import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Github, Mail, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export function SignUpPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate password length
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.signUp({
        username: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // Store user data in auth context
      login({
        id: response.id,
        username: response.username,
        email: response.email,
      });

      // Navigate to home page
      navigate('/');
    } catch (err) {
      setError(
          err instanceof Error
              ? err.message
              : 'Sign up failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubSignUp = () => {
    // Redirect to Spring Boot's OAuth2 login endpoint for GitHub
    window.location.href = 'http://localhost:8080/oauth2/authorization/github';
  };

  const handleGoogleSignUp = () => {
    // Redirect to Spring Boot's OAuth2 login endpoint for Google
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length > 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = getPasswordStrength(formData.password);
  const strengthColors = [
    'bg-slate-200',
    'bg-red-400',
    'bg-orange-400',
    'bg-yellow-400',
    'bg-green-500',
  ];

  return (
      <div className="min-h-screen w-full flex">
        {/* Left Side - Visual */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-bl from-violet-600 to-indigo-900 opacity-90" />

          <div className="absolute inset-0">
            <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-400 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse" />
            <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-violet-400 rounded-full mix-blend-overlay filter blur-3xl opacity-30" />
          </div>

          <div className="relative z-10 flex flex-col justify-between w-full p-12 text-white">
            <Link to="/" className="flex items-center space-x-2 w-fit">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">IVA</span>
            </Link>

            <div className="max-w-md">
              <h2 className="text-4xl font-bold mb-6">Get started for free.</h2>
              <ul className="space-y-4 mb-8">
                {[
                  'Unlimited task automation',
                  'Smart calendar integration',
                  'Email priority sorting',
                  'Basic analytics dashboard',
                ].map((item, i) => (
                    <li
                        key={i}
                        className="flex items-center space-x-3 text-violet-100"
                    >
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span>{item}</span>
                    </li>
                ))}
              </ul>
            </div>

            <div className="text-sm text-violet-200">
              © 2026 IVA Inc. All rights reserved.
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:text-left">
              <Link
                  to="/"
                  className="lg:hidden inline-flex items-center space-x-2 mb-8"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-100 text-violet-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-slate-900">IVA</span>
              </Link>
              <h2 className="text-3xl font-bold text-slate-900">
                Create your account
              </h2>
              <p className="mt-2 text-slate-600">
                Start your 14-day free trial. No credit card required.
              </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                  label="Full Name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
              />

              <Input
                  label="Email address"
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
              />

              <div className="space-y-2">
                <Input
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    helperText="At least 8 characters"
                />

                {/* Password Strength Indicator */}
                {formData.password && (
                    <>
                      <div className="flex gap-1 h-1 mt-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className={`flex-1 rounded-full transition-colors duration-300 ${
                                    strength >= i
                                        ? strengthColors[strength]
                                        : 'bg-slate-100'
                                }`}
                            />
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 text-right">
                        {['Weak', 'Fair', 'Good', 'Strong'][
                            Math.max(0, strength - 1)
                            ] || 'Enter password'}
                      </p>
                    </>
                )}
              </div>

              <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  isLoading={isLoading}
                  rightIcon={!isLoading && <ArrowRight className="w-4 h-4" />}
              >
                Create Account
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">
                or sign up with
              </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGitHubSignUp}
                  disabled={isLoading}
                  leftIcon={<Github className="w-4 h-4" />}
              >
                GitHub
              </Button>
              <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleSignUp}
                  disabled={isLoading}
                  leftIcon={<Mail className="w-4 h-4" />}
              >
                Google
              </Button>
            </div>

            <p className="text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link
                  to="/login"
                  className="font-medium text-violet-600 hover:text-violet-500"
              >
                Sign in
              </Link>
            </p>

            <p className="text-xs text-center text-slate-400 mt-6">
              By signing up, you agree to our{' '}
              <a href="#" className="underline">
                Terms
              </a>{' '}
              and{' '}
              <a href="#" className="underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
  );
}
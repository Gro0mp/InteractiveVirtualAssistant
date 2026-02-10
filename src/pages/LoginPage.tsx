import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Github, Mail } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
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
    setIsLoading(true);

    try {
      const response = await api.login({
        email: formData.email,
        password: formData.password,
      });

      // Store user data in auth context
      login({
        id: response.id,
        username: response.username,
        email: response.email,
        last_login: response.last_login,
      });

      // Navigate to home page
      navigate('/');
    } catch (err) {
      setError(
          err instanceof Error ? err.message : 'Login failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubLogin = () => {
    // Redirect to Spring Boot's OAuth2 login endpoint for GitHub
    window.location.href = 'http://localhost:8080/oauth2/authorization/github';
  };

  const handleGoogleLogin = () => {
    // Redirect to Spring Boot's OAuth2 login endpoint for Google
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
      <div className="min-h-screen w-full flex">
        {/* Left Side - Visual (Hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-900 opacity-90" />

          {/* Decorative Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-400 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400 rounded-full mix-blend-overlay filter blur-3xl opacity-20" />
          </div>

          <div className="relative z-10 flex flex-col justify-between w-full p-12 text-white">
            <Link to="/" className="flex items-center space-x-2 w-fit">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">IVA</span>
            </Link>

            <div className="max-w-md">
              <h2 className="text-4xl font-bold mb-6">
                Welcome back to your intelligent workspace.
              </h2>
              <p className="text-violet-100 text-lg leading-relaxed">
                "IVA has completely transformed how I manage my daily tasks. It's
                like having a personal assistant that never sleeps."
              </p>
              <div className="mt-8 flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-white/20" />
                <div>
                  <p className="font-medium">Sarah Chen</p>
                  <p className="text-sm text-violet-200">
                    Product Manager at TechFlow
                  </p>
                </div>
              </div>
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
              <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
              <p className="mt-2 text-slate-600">
                Sign in to your account to continue
              </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <a
                      href="#"
                      className="text-sm font-medium text-violet-600 hover:text-violet-500"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                />
              </div>

              <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  isLoading={isLoading}
                  rightIcon={!isLoading && <ArrowRight className="w-4 h-4" />}
              >
                Sign In
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">
                or continue with
              </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGitHubLogin}
                  disabled={isLoading}
                  leftIcon={<Github className="w-4 h-4" />}
              >
                GitHub
              </Button>
              <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  leftIcon={<Mail className="w-4 h-4" />}
              >
                Google
              </Button>
            </div>

            <p className="text-center text-sm text-slate-600">
              Don't have an account?{' '}
              <Link
                  to="/signup"
                  className="font-medium text-violet-600 hover:text-violet-500"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
  );
}
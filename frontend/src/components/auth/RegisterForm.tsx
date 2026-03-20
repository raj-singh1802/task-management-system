'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await registerUser(data.name, data.email, data.password);
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="name"
        type="text"
        label="Full Name"
        placeholder="John Doe"
        icon={<User className="w-4 h-4" />}
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        id="email"
        type="email"
        label="Email Address"
        placeholder="you@example.com"
        icon={<Mail className="w-4 h-4" />}
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        id="password"
        type="password"
        label="Password"
        placeholder="••••••••"
        icon={<Lock className="w-4 h-4" />}
        error={errors.password?.message}
        {...register('password')}
      />
      <Input
        id="confirmPassword"
        type="password"
        label="Confirm Password"
        placeholder="••••••••"
        icon={<Lock className="w-4 h-4" />}
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />
      <Button type="submit" className="w-full" isLoading={isLoading}>
        Create Account
      </Button>
    </form>
  );
}

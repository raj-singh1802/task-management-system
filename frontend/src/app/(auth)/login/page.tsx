import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { LoginForm } from '../../../components/auth/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <Card className="mt-8 border-gray-200">
      <CardHeader>
        <CardTitle className="text-center">Welcome Back</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Don't have an account? </span>
          <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

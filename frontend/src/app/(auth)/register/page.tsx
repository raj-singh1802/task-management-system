import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { RegisterForm } from '../../../components/auth/RegisterForm';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <Card className="mt-8 border-gray-200">
      <CardHeader>
        <CardTitle className="text-center">Create Account</CardTitle>
        <CardDescription className="text-center">
          Sign up to start managing your tasks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Already have an account? </span>
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Log in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

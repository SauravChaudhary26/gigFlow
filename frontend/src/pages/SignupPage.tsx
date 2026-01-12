import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/Card';

const SignupPage = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm();
    const navigate = useNavigate();
    const { login } = useAuth();

    const onSubmit = async (data: any) => {
        try {
            const response = await api.post('/auth/signup', data);
            login(response.data);
            navigate('/');
        } catch (error: any) {
            console.error(error);
            setError('root', {
                message: error.response?.data?.message || 'Signup failed. Please try again.'
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center text-green-600">Join GigFlow</CardTitle>
                    <p className="text-center text-gray-500 font-normal">Create your account and start earning</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input
                            label="Full Name"
                            placeholder="John Doe"
                            {...register('name', { required: 'Name is required' })}
                            error={errors.name?.message as string}
                        />
                        <Input
                            label="Email"
                            type="email"
                            placeholder="you@example.com"
                            {...register('email', { required: 'Email is required' })}
                            error={errors.email?.message as string}
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                            error={errors.password?.message as string}
                        />
                         {errors.root && (
                            <p className="text-sm text-red-500 text-center">{errors.root.message as string}</p>
                        )}
                        <Button type="submit" className="w-full" isLoading={isSubmitting}>
                            Sign Up
                        </Button>
                    </form>
                </CardContent>
                 <CardFooter className="justify-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
                            Login
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default SignupPage;

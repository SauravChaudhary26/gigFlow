import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

const CreateGigPage = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data: any) => {
        try {
            await api.post('/gigs', data);
            navigate('/');
        } catch (error: any) {
            console.error(error);
            setError('root', {
                message: error.response?.data?.message || 'Failed to create gig'
            });
        }
    };

    return (
        <div className="flex justify-center">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl text-green-600">Post a New Gig</CardTitle>
                    <p className="text-gray-500 font-normal">Details about the project you need help with.</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <Input
                            label="Project Title"
                            placeholder="e.g. Build a Responsive React Website"
                            {...register('title', { required: 'Title is required', minLength: { value: 5, message: 'Title must be at least 5 characters' } })}
                            error={errors.title?.message as string}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Description
                            </label>
                            <textarea
                                className={`w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 min-h-[150px] ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
                                placeholder="Describe the project requirements in detail..."
                                {...register('description', { required: 'Description is required', minLength: { value: 20, message: 'Description must be at least 20 characters' } })}
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-500">{errors.description.message as string}</p>
                            )}
                        </div>

                        <Input
                            label="Budget (₹)"
                            type="number"
                            placeholder="500"
                            {...register('budget', { required: 'Budget is required', min: { value: 5, message: 'Minimum budget is ₹5' } })}
                            error={errors.budget?.message as string}
                        />

                        {errors.root && (
                            <p className="text-sm text-red-500 text-center">{errors.root.message as string}</p>
                        )}

                        <div className="flex justify-end space-x-4">
                            <Button type="button" variant="ghost" onClick={() => navigate('/')}>
                                Cancel
                            </Button>
                            <Button type="submit" isLoading={isSubmitting}>
                                Post Gig
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateGigPage;

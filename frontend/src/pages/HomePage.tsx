import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, IndianRupee, Clock, User } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface Gig {
    _id: string;
    title: string;
    description: string;
    budget: number;
    ownerId: {
        _id: string;
        name: string;
    };
    status: string;
    createdAt: string;
}

const HomePage = () => {
    const [gigs, setGigs] = useState<Gig[]>([{_id: "", title: "", description: "", budget: 0, ownerId: {_id: "", name: ""}, status: "", createdAt: ""}]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchGigs = async () => {
            try {
                const response = await api.get(`/gigs?title=${searchTerm}`);
                if (Array.isArray(response.data)) {
                    setGigs(response.data);
                } else {
                    console.error("Fetched gigs is not an array:", response.data);
                    setGigs([]); 
                }
            } catch (error) {
                console.error("Failed to fetch gigs", error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchGigs();
        }, 500); // Debounce search

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Available Gigs
                </h1>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input 
                        placeholder="Search gigs..." 
                        className="pl-10" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                </div>
            ) : gigs.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                    <p className="text-gray-500">No gigs found matching your search.</p>
                    <Link to="/create-gig" className="mt-4 inline-block">
                        <Button variant="outline">Post a Gig</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gigs.map((gig) => (
                        <Card key={gig._id} className="hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-green-500 flex flex-col">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="line-clamp-1 text-xl">{gig.title}</CardTitle>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                        gig.status === 'open' 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {gig.status === 'assigned' ? 'Assigned' : gig.status.toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex items-center text-sm text-gray-500 mt-2">
                                    <User className="h-4 w-4 mr-1" />
                                    {gig.ownerId.name}
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                                    {gig.description}
                                </p>
                                <div className="flex items-center justify-between text-sm text-gray-500 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center font-semibold text-gray-900 dark:text-gray-100">
                                        <IndianRupee className="h-4 w-4 text-green-600 mr-1" />
                                        {gig.budget}
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-1" />
                                        {/* Simple date formatting if date-fns is not installed */}
                                        {new Date(gig.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Link to={`/gigs/${gig._id}`} className="w-full">
                                    <Button className="w-full">View Details</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Loader2, DollarSign, User, Calendar, CheckCircle, XCircle } from 'lucide-react';

interface Bid {
    _id: string;
    freelancerId: {
        _id: string;
        name: string;
        email: string;
    };
    message: string;
    bidPrice: number;
    status: 'pending' | 'hired' | 'rejected';
    createdAt: string;
}

interface Gig {
    _id: string;
    title: string;
    description: string;
    budget: number;
    ownerId: {
        _id: string;
        name: string;
        email: string;
    };
    status: 'open' | 'assigned';
    createdAt: string;
}

const GigDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [gig, setGig] = useState<Gig | null>(null);
    const [bids, setBids] = useState<Bid[]>([]);
    const [loading, setLoading] = useState(true);
    const [bidsLoading, setBidsLoading] = useState(false);
    
    // For placing a bid
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();

    useEffect(() => {
        const fetchGigDetails = async () => {
            try {
                const response = await api.get(`/gigs`); 
                // Note: The provided backend snippets only showed getAllGigs filtering by query. 
                // Assuming there is or we must rely on filtering the list or a unified get endpoint.
                // Wait, typically there is a GET /api/gigs/:id. 
                // Looking at provided routes: router.get('/', getAllGigs); 
                // It seems there isn't a single gig endpoint in the snippet provided!
                // I will assume for now I have to fetch all and find, OR simpler, I will implement the assumption that
                // standard REST practice /api/gigs/:id exists or I should add it.
                // Given I cannot modify backend now easily without stepping back, I will check 
                // if I can filter the list from the response of getAllGigs.
                // Actually, let's look at the snippets again. 
                // Accessing `backend/src/routes/gigRoutes.js` showed `router.get('/', getAllGigs);`
                // It does NOT have `/:id`. 
                // However, I can fetch all and filter client side for this demo, 
                // OR I can quick-fix backend. 
                // Let's filter client side to be safe with "existing backend" constraint unless blocked.
                const allGigs = await api.get('/gigs');
                const foundGig = allGigs.data.find((g: Gig) => g._id === id);
                
                if (foundGig) {
                    setGig(foundGig);
                    // Only fetch bids if user is owner
                    if (user && user._id === foundGig.ownerId._id) {
                         fetchBids();
                    }
                } else {
                    // Handle not found
                    console.error("Gig not found");
                }
            } catch (error) {
                console.error("Failed to fetch gig details", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGigDetails();
    }, [id, user]);

    const fetchBids = async () => {
        try {
            setBidsLoading(true);
            const response = await api.get(`/bids/${id}`);
            setBids(response.data);
        } catch (error) {
            console.error("Failed to fetch bids", error);
        } finally {
            setBidsLoading(false);
        }
    }

    const onPlaceBid = async (data: any) => {
        try {
            await api.post('/bids', {
                gigId: id,
                ...data
            });
            reset();
            alert('Bid placed successfully!');
            // Ideally refresh or navigate
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to place bid');
        }
    };

    const onHire = async (bidId: string) => {
        if (!window.confirm("Are you sure you want to hire this freelancer?")) return;
        try {
            await api.patch(`/bids/${bidId}/hire`);
            // Refresh data
            setGig(prev => prev ? { ...prev, status: 'assigned' } : null);
            setBids(prev => prev.map(b => 
                b._id === bidId ? { ...b, status: 'hired' } : { ...b, status: 'rejected' }
            ));
            alert('Freelancer hired!');
        } catch (error: any) {
             alert(error.response?.data?.message || 'Failed to hire freelancer');
        }
    }

    if (loading) {
        return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-green-600" /></div>;
    }

    if (!gig) {
        return <div className="text-center py-12">Gig not found</div>;
    }

    const isOwner = user && user._id === gig.ownerId._id;
    const isFreelancer = user && user._id !== gig.ownerId._id;

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-3xl">{gig.title}</CardTitle>
                         <span className={`px-3 py-1 rounded-full text-sm font-medium ${gig.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {gig.status.toUpperCase()}
                        </span>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-6 text-gray-500">
                        <div className="flex items-center">
                            <User className="h-5 w-5 mr-2" />
                            Posted by {gig.ownerId.name}
                        </div>
                        <div className="flex items-center">
                            <DollarSign className="h-5 w-5 mr-2" />
                            Budget: ${gig.budget}
                        </div>
                        <div className="flex items-center">
                            <Calendar className="h-5 w-5 mr-2" />
                            {new Date(gig.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                    <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{gig.description}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Bidding Section */}
            {isFreelancer && gig.status === 'open' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Place a Bid</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onPlaceBid)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Bid Amount ($)"
                                    type="number"
                                    placeholder="500"
                                    {...register('bidPrice', { required: 'Bid price is required' })}
                                    error={errors.bidPrice?.message as string}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                    Cover Letter
                                </label>
                                <textarea
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 outline-none"
                                    rows={4}
                                    placeholder="Why are you the best fit for this job?"
                                    {...register('message', { required: 'Message is required' })}
                                />
                                {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message.message as string}</p>}
                            </div>
                            <Button type="submit" isLoading={isSubmitting}>Submit Proposal</Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Owner View: List of Bids */}
            {isOwner && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Proposals ({bids.length})</h2>
                    {bidsLoading ? (
                        <Loader2 className="animate-spin" />
                    ) : bids.length === 0 ? (
                        <p className="text-gray-500">No bids yet.</p>
                    ) : (
                        bids.map((bid) => (
                            <Card key={bid._id} className={bid.status === 'hired' ? 'border-green-500 border-2' : ''}>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-lg">{bid.freelancerId.name}</h4>
                                            <p className="text-sm text-gray-500">{bid.freelancerId.email}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xl font-bold text-green-600">${bid.bidPrice}</span>
                                            <div className="text-xs text-gray-400">
                                                {new Date(bid.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                                        {bid.message}
                                    </p>
                                    <div className="mt-4 flex justify-end items-center space-x-4">
                                        {bid.status === 'hired' && (
                                            <span className="flex items-center text-green-600 font-bold">
                                                <CheckCircle className="h-5 w-5 mr-1" /> Hired
                                            </span>
                                        )}
                                        {bid.status === 'rejected' && (
                                            <span className="flex items-center text-red-500">
                                                <XCircle className="h-5 w-5 mr-1" /> Rejected
                                            </span>
                                        )}
                                        {bid.status === 'pending' && gig.status === 'open' && (
                                            <Button onClick={() => onHire(bid._id)}>Hire Freelancer</Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default GigDetailsPage;

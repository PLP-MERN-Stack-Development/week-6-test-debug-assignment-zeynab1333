import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Bug, Search, Filter, Plus, Eye, Edit, Trash2, AlertCircle } from 'lucide-react';

const BugList = () => {
    const [bugs, setBugs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        severity: '',
        search: ''
    });
    const [sortBy, setSortBy] = useState('-createdAt');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    console.log('🔍 BugList component rendered with filters:', filters); // Debug log

    useEffect(() => {
        fetchBugs();
    }, [filters, sortBy, currentPage]);

    const fetchBugs = async () => {
        try {
            console.log('📡 Fetching bugs with params:', { ...filters, sort: sortBy, page: currentPage }); // Debug log

            setLoading(true);
            const params = new URLSearchParams();

            // Add filters
            Object.keys(filters).forEach(key => {
                if (filters[key]) {
                    params.append(key, filters[key]);
                }
            });

            // Add sorting and pagination
            params.append('sort', sortBy);
            params.append('page', currentPage);
            params.append('limit', 10);

            const response = await axios.get(`/api/bugs?${params}`);

            console.log('✅ Bugs fetched successfully:', response.data); // Debug log

            setBugs(response.data.data);
            setTotalPages(response.data.pagination.pages);
            setError(null);
        } catch (err) {
            console.error('❌ Error fetching bugs:', err); // Debug log
            setError('Failed to fetch bugs');
            toast.error('Failed to load bugs');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this bug?')) {
            return;
        }

        try {
            console.log('🗑️ Deleting bug:', id); // Debug log

            await axios.delete(`/api/bugs/${id}`);
            toast.success('Bug deleted successfully');

            // Refresh the list
            fetchBugs();
        } catch (err) {
            console.error('❌ Error deleting bug:', err); // Debug log
            toast.error('Failed to delete bug');
        }
    };

    const handleFilterChange = (key, value) => {
        console.log('🔧 Filter changed:', key, value); // Debug log
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handleSortChange = (value) => {
        console.log('📊 Sort changed:', value); // Debug log
        setSortBy(value);
        setCurrentPage(1);
    };

    const getStatusColor = (status) => {
        const colors = {
            'open': 'bg-red-100 text-red-800 hover:bg-red-200',
            'in-progress': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
            'resolved': 'bg-green-100 text-green-800 hover:bg-green-200',
            'closed': 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            'low': 'bg-green-100 text-green-800 hover:bg-green-200',
            'medium': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
            'high': 'bg-orange-100 text-orange-800 hover:bg-orange-200',
            'critical': 'bg-red-100 text-red-800 hover:bg-red-200'
        };
        return colors[priority] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground">Loading bugs...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    {error}
                    <Button variant="outline" size="sm" onClick={fetchBugs} className="ml-2">
                        Try Again
                    </Button>
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Bug Tracker</h1>
                <Link to="/bugs/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Report New Bug
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filters & Search
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                        <div className="lg:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search bugs..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Statuses</SelectItem>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={filters.priority} onValueChange={(value) => handleFilterChange('priority', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Priorities" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Priorities</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={filters.severity} onValueChange={(value) => handleFilterChange('severity', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Severities" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Severities</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={sortBy} onValueChange={handleSortChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="-createdAt">Newest First</SelectItem>
                                <SelectItem value="createdAt">Oldest First</SelectItem>
                                <SelectItem value="title">Title A-Z</SelectItem>
                                <SelectItem value="-title">Title Z-A</SelectItem>
                                <SelectItem value="priority">Priority</SelectItem>
                                <SelectItem value="status">Status</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Bug List */}
            {bugs.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Bug className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No bugs found</h3>
                        <p className="text-muted-foreground text-center">
                            Try adjusting your filters or report a new bug.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bugs.map((bug) => (
                        <Card key={bug._id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg">
                                        <Link to={`/bugs/${bug._id}`} className="hover:text-primary transition-colors">
                                            {bug.title}
                                        </Link>
                                    </CardTitle>
                                    <div className="flex gap-2">
                                        <Badge className={getStatusColor(bug.status)}>
                                            {bug.status}
                                        </Badge>
                                        <Badge className={getPriorityColor(bug.priority)}>
                                            {bug.priority}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {bug.description.length > 100
                                        ? `${bug.description.substring(0, 100)}...`
                                        : bug.description
                                    }
                                </p>

                                <div className="flex justify-between items-center text-xs text-muted-foreground">
                                    <span>By: {bug.reporter}</span>
                                    <span>{new Date(bug.createdAt).toLocaleDateString()}</span>
                                </div>

                                <div className="flex gap-2">
                                    <Link to={`/bugs/${bug._id}`}>
                                        <Button variant="outline" size="sm">
                                            <Eye className="mr-1 h-3 w-3" />
                                            View
                                        </Button>
                                    </Link>
                                    <Link to={`/bugs/${bug._id}/edit`}>
                                        <Button variant="outline" size="sm">
                                            <Edit className="mr-1 h-3 w-3" />
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(bug._id)}
                                    >
                                        <Trash2 className="mr-1 h-3 w-3" />
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <Card>
                    <CardContent className="flex justify-center items-center py-4">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>

                            <span className="text-sm text-muted-foreground">
                                Page {currentPage} of {totalPages}
                            </span>

                            <Button
                                variant="outline"
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default BugList; 
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { ArrowLeft, Edit, Trash2, MessageSquare, Send, AlertCircle, Loader2, Calendar, User, Tag } from 'lucide-react';
import { Label } from './ui/label';

const BugDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bug, setBug] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comment, setComment] = useState('');
    const [commentAuthor, setCommentAuthor] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

    useEffect(() => {
        fetchBug();
    }, [id]);

    const fetchBug = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/bugs/${id}`);
            setBug(response.data.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching bug:', err);
            setError('Failed to load bug details');
            toast.error('Failed to load bug details');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this bug?')) {
            return;
        }

        try {
            await axios.delete(`/api/bugs/${id}`);
            toast.success('Bug deleted successfully');
            navigate('/bugs');
        } catch (err) {
            console.error('Error deleting bug:', err);
            toast.error('Failed to delete bug');
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();

        if (!comment.trim() || !commentAuthor.trim()) {
            toast.error('Please provide both author name and comment content');
            return;
        }

        try {
            setSubmittingComment(true);
            await axios.post(`/api/bugs/${id}/comments`, {
                author: commentAuthor,
                content: comment
            });

            toast.success('Comment added successfully');
            setComment('');
            setCommentAuthor('');
            fetchBug(); // Refresh to get updated comments
        } catch (err) {
            console.error('Error adding comment:', err);
            toast.error('Failed to add comment');
        } finally {
            setSubmittingComment(false);
        }
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
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Loading bug details...</p>
            </div>
        );
    }

    if (error || !bug) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    {error || 'Bug not found'}
                    <Button variant="outline" size="sm" onClick={() => navigate('/bugs')} className="ml-2">
                        Back to Bugs
                    </Button>
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/bugs')}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Bugs
                    </Button>
                    <h1 className="text-3xl font-bold">{bug.title}</h1>
                </div>
                <div className="flex gap-2">
                    <Link to={`/bugs/${id}/edit`}>
                        <Button variant="outline">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                    </Link>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Bug Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground whitespace-pre-wrap">{bug.description}</p>
                        </CardContent>
                    </Card>

                    {/* Additional Details */}
                    {(bug.stepsToReproduce || bug.expectedBehavior || bug.actualBehavior) && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Additional Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {bug.stepsToReproduce && (
                                    <div>
                                        <h4 className="font-medium mb-2">Steps to Reproduce</h4>
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{bug.stepsToReproduce}</p>
                                    </div>
                                )}
                                {bug.expectedBehavior && (
                                    <div>
                                        <h4 className="font-medium mb-2">Expected Behavior</h4>
                                        <p className="text-sm text-muted-foreground">{bug.expectedBehavior}</p>
                                    </div>
                                )}
                                {bug.actualBehavior && (
                                    <div>
                                        <h4 className="font-medium mb-2">Actual Behavior</h4>
                                        <p className="text-sm text-muted-foreground">{bug.actualBehavior}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Comments */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                Comments ({bug.comments?.length || 0})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Add Comment Form */}
                            <form onSubmit={handleAddComment} className="space-y-3 p-4 border rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <Input
                                        placeholder="Your name"
                                        value={commentAuthor}
                                        onChange={(e) => setCommentAuthor(e.target.value)}
                                        required
                                    />
                                    <Button
                                        type="submit"
                                        disabled={submittingComment}
                                        className="md:w-auto"
                                    >
                                        {submittingComment ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Send className="mr-2 h-4 w-4" />
                                        )}
                                        Add Comment
                                    </Button>
                                </div>
                                <Textarea
                                    placeholder="Write your comment..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows={3}
                                    required
                                />
                            </form>

                            {/* Comments List */}
                            <div className="space-y-3">
                                {bug.comments && bug.comments.length > 0 ? (
                                    bug.comments.map((comment, index) => (
                                        <div key={index} className="p-3 border rounded-lg">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-medium text-sm">{comment.author}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(comment.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{comment.content}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-muted-foreground py-4">No comments yet</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status and Priority */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Status & Priority</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <Label className="text-sm font-medium">Status</Label>
                                <Badge className={`mt-1 ${getStatusColor(bug.status)}`}>
                                    {bug.status}
                                </Badge>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">Priority</Label>
                                <Badge className={`mt-1 ${getPriorityColor(bug.priority)}`}>
                                    {bug.priority}
                                </Badge>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">Severity</Label>
                                <Badge className={`mt-1 ${getPriorityColor(bug.severity)}`}>
                                    {bug.severity}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bug Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Bug Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Reporter:</span>
                                <span>{bug.reporter}</span>
                            </div>
                            {bug.assignedTo && (
                                <div className="flex items-center gap-2 text-sm">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Assigned to:</span>
                                    <span>{bug.assignedTo}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Created:</span>
                                <span>{new Date(bug.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Updated:</span>
                                <span>{new Date(bug.updatedAt).toLocaleDateString()}</span>
                            </div>
                            {bug.environment && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Tag className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Environment:</span>
                                    <span>{bug.environment}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Tags */}
                    {bug.tags && bug.tags.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Tags</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {bug.tags.map((tag, index) => (
                                        <Badge key={index} variant="secondary">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BugDetail; 
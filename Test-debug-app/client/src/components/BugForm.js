import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { ArrowLeft, Save, X, AlertCircle, Loader2 } from 'lucide-react';

const BugForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        reporter: '',
        assignedTo: '',
        status: 'open',
        priority: 'medium',
        severity: 'medium',
        stepsToReproduce: '',
        expectedBehavior: '',
        actualBehavior: '',
        environment: '',
        tags: []
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [tagInput, setTagInput] = useState('');

    console.log('📝 BugForm rendered, isEditing:', isEditing, 'id:', id); // Debug log

    useEffect(() => {
        if (isEditing) {
            fetchBug();
        }
    }, [id]);

    const fetchBug = async () => {
        try {
            console.log('📡 Fetching bug for editing:', id); // Debug log

            setLoading(true);
            const response = await axios.get(`/api/bugs/${id}`);

            console.log('✅ Bug fetched for editing:', response.data); // Debug log

            setFormData(response.data.data);
        } catch (err) {
            console.error('❌ Error fetching bug:', err); // Debug log
            toast.error('Failed to load bug data');
            navigate('/bugs');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.length > 100) {
            newErrors.title = 'Title must be 100 characters or less';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (formData.description.length > 1000) {
            newErrors.description = 'Description must be 1000 characters or less';
        }

        if (!formData.reporter.trim()) {
            newErrors.reporter = 'Reporter name is required';
        }

        if (formData.stepsToReproduce && formData.stepsToReproduce.length > 500) {
            newErrors.stepsToReproduce = 'Steps to reproduce must be 500 characters or less';
        }

        if (formData.expectedBehavior && formData.expectedBehavior.length > 300) {
            newErrors.expectedBehavior = 'Expected behavior must be 300 characters or less';
        }

        if (formData.actualBehavior && formData.actualBehavior.length > 300) {
            newErrors.actualBehavior = 'Actual behavior must be 300 characters or less';
        }

        if (formData.environment && formData.environment.length > 200) {
            newErrors.environment = 'Environment must be 200 characters or less';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('📤 Submitting form data:', formData); // Debug log

        if (!validateForm()) {
            console.log('❌ Form validation failed:', errors); // Debug log
            toast.error('Please fix the errors in the form');
            return;
        }

        try {
            setLoading(true);

            if (isEditing) {
                console.log('🔄 Updating existing bug'); // Debug log
                await axios.put(`/api/bugs/${id}`, formData);
                toast.success('Bug updated successfully');
            } else {
                console.log('➕ Creating new bug'); // Debug log
                await axios.post('/api/bugs', formData);
                toast.success('Bug reported successfully');
            }

            navigate('/bugs');
        } catch (err) {
            console.error('❌ Error submitting form:', err); // Debug log

            if (err.response?.data?.error) {
                toast.error(err.response.data.error);
            } else {
                toast.error('Failed to save bug');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log('📝 Form field changed:', name, value); // Debug log

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSelectChange = (name, value) => {
        console.log('📝 Select field changed:', name, value); // Debug log

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTagInputChange = (e) => {
        setTagInput(e.target.value);
    };

    const handleAddTag = (e) => {
        e.preventDefault();

        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            console.log('🏷️ Adding tag:', tagInput.trim()); // Debug log

            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        console.log('🗑️ Removing tag:', tagToRemove); // Debug log

        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    if (loading && isEditing) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Loading bug data...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">{isEditing ? 'Edit Bug' : 'Report New Bug'}</h1>
                <Button
                    variant="outline"
                    onClick={() => navigate('/bugs')}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Bugs
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Brief description of the bug"
                                    maxLength={100}
                                    className={errors.title ? 'border-destructive' : ''}
                                />
                                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reporter">Reporter *</Label>
                                <Input
                                    id="reporter"
                                    name="reporter"
                                    value={formData.reporter}
                                    onChange={handleChange}
                                    placeholder="Your name"
                                    className={errors.reporter ? 'border-destructive' : ''}
                                />
                                {errors.reporter && <p className="text-sm text-destructive">{errors.reporter}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Detailed description of the bug"
                                rows={4}
                                maxLength={1000}
                                className={errors.description ? 'border-destructive' : ''}
                            />
                            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="assignedTo">Assigned To</Label>
                            <Input
                                id="assignedTo"
                                name="assignedTo"
                                value={formData.assignedTo}
                                onChange={handleChange}
                                placeholder="Developer name (optional)"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Classification */}
                <Card>
                    <CardHeader>
                        <CardTitle>Classification</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="open">Open</SelectItem>
                                        <SelectItem value="in-progress">In Progress</SelectItem>
                                        <SelectItem value="resolved">Resolved</SelectItem>
                                        <SelectItem value="closed">Closed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="priority">Priority</Label>
                                <Select value={formData.priority} onValueChange={(value) => handleSelectChange('priority', value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="critical">Critical</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="severity">Severity</Label>
                                <Select value={formData.severity} onValueChange={(value) => handleSelectChange('severity', value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="critical">Critical</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Additional Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Additional Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="stepsToReproduce">Steps to Reproduce</Label>
                            <Textarea
                                id="stepsToReproduce"
                                name="stepsToReproduce"
                                value={formData.stepsToReproduce}
                                onChange={handleChange}
                                placeholder="1. Go to...&#10;2. Click on...&#10;3. See error"
                                rows={3}
                                maxLength={500}
                                className={errors.stepsToReproduce ? 'border-destructive' : ''}
                            />
                            {errors.stepsToReproduce && <p className="text-sm text-destructive">{errors.stepsToReproduce}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="expectedBehavior">Expected Behavior</Label>
                                <Textarea
                                    id="expectedBehavior"
                                    name="expectedBehavior"
                                    value={formData.expectedBehavior}
                                    onChange={handleChange}
                                    placeholder="What should happen"
                                    rows={2}
                                    maxLength={300}
                                    className={errors.expectedBehavior ? 'border-destructive' : ''}
                                />
                                {errors.expectedBehavior && <p className="text-sm text-destructive">{errors.expectedBehavior}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="actualBehavior">Actual Behavior</Label>
                                <Textarea
                                    id="actualBehavior"
                                    name="actualBehavior"
                                    value={formData.actualBehavior}
                                    onChange={handleChange}
                                    placeholder="What actually happens"
                                    rows={2}
                                    maxLength={300}
                                    className={errors.actualBehavior ? 'border-destructive' : ''}
                                />
                                {errors.actualBehavior && <p className="text-sm text-destructive">{errors.actualBehavior}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="environment">Environment</Label>
                            <Input
                                id="environment"
                                name="environment"
                                value={formData.environment}
                                onChange={handleChange}
                                placeholder="e.g., Chrome 90, Windows 10, iOS 14"
                                maxLength={200}
                                className={errors.environment ? 'border-destructive' : ''}
                            />
                            {errors.environment && <p className="text-sm text-destructive">{errors.environment}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={tagInput}
                                    onChange={handleTagInputChange}
                                    placeholder="Add a tag and press Enter"
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag(e)}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleAddTag}
                                >
                                    Add
                                </Button>
                            </div>

                            {formData.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.tags.map((tag, index) => (
                                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag)}
                                                className="ml-1 hover:text-destructive"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/bugs')}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                {isEditing ? 'Update Bug' : 'Report Bug'}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default BugForm; 
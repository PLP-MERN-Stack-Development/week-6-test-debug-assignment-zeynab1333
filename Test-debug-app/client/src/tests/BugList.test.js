import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import BugList from '../components/BugList';

// Mock dependencies
jest.mock('axios');
jest.mock('react-toastify');

const mockBugs = [
    {
        _id: '1',
        title: 'Test Bug 1',
        description: 'This is a test bug',
        reporter: 'John Doe',
        status: 'open',
        priority: 'high',
        severity: 'medium',
        createdAt: '2023-01-01T00:00:00.000Z'
    },
    {
        _id: '2',
        title: 'Test Bug 2',
        description: 'This is another test bug',
        reporter: 'Jane Smith',
        status: 'resolved',
        priority: 'medium',
        severity: 'low',
        createdAt: '2023-01-02T00:00:00.000Z'
    }
];

const renderWithRouter = (component) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    );
};

describe('BugList Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders loading state initially', () => {
        axios.get.mockImplementation(() => new Promise(() => { }));

        renderWithRouter(<BugList />);

        expect(screen.getByText('Loading bugs...')).toBeInTheDocument();
    });

    it('renders bugs after successful API call', async () => {
        axios.get.mockResolvedValue({
            data: {
                success: true,
                data: mockBugs,
                count: 2,
                pagination: { page: 1, pages: 1 }
            }
        });

        renderWithRouter(<BugList />);

        await waitFor(() => {
            expect(screen.getByText('Test Bug 1')).toBeInTheDocument();
            expect(screen.getByText('Test Bug 2')).toBeInTheDocument();
        });
    });

    it('renders error state when API call fails', async () => {
        axios.get.mockRejectedValue(new Error('API Error'));

        renderWithRouter(<BugList />);

        await waitFor(() => {
            expect(screen.getByText('Error')).toBeInTheDocument();
            expect(screen.getByText('Failed to fetch bugs')).toBeInTheDocument();
        });
    });

    it('filters bugs by status', async () => {
        axios.get.mockResolvedValue({
            data: {
                success: true,
                data: mockBugs,
                count: 2,
                pagination: { page: 1, pages: 1 }
            }
        });

        renderWithRouter(<BugList />);

        await waitFor(() => {
            expect(screen.getByText('Test Bug 1')).toBeInTheDocument();
        });

        const statusSelect = screen.getByDisplayValue('All Statuses');
        fireEvent.change(statusSelect, { target: { value: 'open' } });

        expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining('/api/bugs?status=open')
        );
    });

    it('filters bugs by priority', async () => {
        axios.get.mockResolvedValue({
            data: {
                success: true,
                data: mockBugs,
                count: 2,
                pagination: { page: 1, pages: 1 }
            }
        });

        renderWithRouter(<BugList />);

        await waitFor(() => {
            expect(screen.getByText('Test Bug 1')).toBeInTheDocument();
        });

        const prioritySelect = screen.getByDisplayValue('All Priorities');
        fireEvent.change(prioritySelect, { target: { value: 'high' } });

        expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining('/api/bugs?priority=high')
        );
    });

    it('searches bugs by text', async () => {
        axios.get.mockResolvedValue({
            data: {
                success: true,
                data: mockBugs,
                count: 2,
                pagination: { page: 1, pages: 1 }
            }
        });

        renderWithRouter(<BugList />);

        await waitFor(() => {
            expect(screen.getByText('Test Bug 1')).toBeInTheDocument();
        });

        const searchInput = screen.getByPlaceholderText('Search bugs...');
        fireEvent.change(searchInput, { target: { value: 'test' } });

        expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining('/api/bugs?search=test')
        );
    });

    it('sorts bugs by different criteria', async () => {
        axios.get.mockResolvedValue({
            data: {
                success: true,
                data: mockBugs,
                count: 2,
                pagination: { page: 1, pages: 1 }
            }
        });

        renderWithRouter(<BugList />);

        await waitFor(() => {
            expect(screen.getByText('Test Bug 1')).toBeInTheDocument();
        });

        const sortSelect = screen.getByDisplayValue('Newest First');
        fireEvent.change(sortSelect, { target: { value: 'title' } });

        expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining('/api/bugs?sort=title')
        );
    });

    it('deletes a bug when delete button is clicked', async () => {
        axios.get.mockResolvedValue({
            data: {
                success: true,
                data: mockBugs,
                count: 2,
                pagination: { page: 1, pages: 1 }
            }
        });

        axios.delete.mockResolvedValue({ data: { success: true } });

        // Mock window.confirm
        window.confirm = jest.fn(() => true);

        renderWithRouter(<BugList />);

        await waitFor(() => {
            expect(screen.getByText('Test Bug 1')).toBeInTheDocument();
        });

        const deleteButtons = screen.getAllByText('Delete');
        fireEvent.click(deleteButtons[0]);

        expect(window.confirm).toHaveBeenCalled();
        expect(axios.delete).toHaveBeenCalledWith('/api/bugs/1');
        expect(toast.success).toHaveBeenCalledWith('Bug deleted successfully');
    });

    it('shows no bugs message when no bugs are found', async () => {
        axios.get.mockResolvedValue({
            data: {
                success: true,
                data: [],
                count: 0,
                pagination: { page: 1, pages: 0 }
            }
        });

        renderWithRouter(<BugList />);

        await waitFor(() => {
            expect(screen.getByText('No bugs found')).toBeInTheDocument();
            expect(screen.getByText('Try adjusting your filters or report a new bug.')).toBeInTheDocument();
        });
    });

    it('navigates to new bug form when "Report New Bug" is clicked', async () => {
        axios.get.mockResolvedValue({
            data: {
                success: true,
                data: mockBugs,
                count: 2,
                pagination: { page: 1, pages: 1 }
            }
        });

        renderWithRouter(<BugList />);

        await waitFor(() => {
            expect(screen.getByText('Test Bug 1')).toBeInTheDocument();
        });

        const newBugLink = screen.getByText('Report New Bug');
        expect(newBugLink).toHaveAttribute('href', '/bugs/new');
    });

    it('displays bug information correctly', async () => {
        axios.get.mockResolvedValue({
            data: {
                success: true,
                data: mockBugs,
                count: 2,
                pagination: { page: 1, pages: 1 }
            }
        });

        renderWithRouter(<BugList />);

        await waitFor(() => {
            expect(screen.getByText('Test Bug 1')).toBeInTheDocument();
            expect(screen.getByText('This is a test bug')).toBeInTheDocument();
            expect(screen.getByText('By: John Doe')).toBeInTheDocument();
            expect(screen.getByText('open')).toBeInTheDocument();
            expect(screen.getByText('high')).toBeInTheDocument();
        });
    });

    it('handles pagination correctly', async () => {
        axios.get.mockResolvedValue({
            data: {
                success: true,
                data: mockBugs,
                count: 2,
                pagination: { page: 1, pages: 3 }
            }
        });

        renderWithRouter(<BugList />);

        await waitFor(() => {
            expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
        });

        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);

        expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining('/api/bugs?page=2')
        );
    });
}); 
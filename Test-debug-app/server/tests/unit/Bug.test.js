const mongoose = require('mongoose');
const Bug = require('../../models/Bug');

describe('Bug Model', () => {
    describe('Validation', () => {
        it('should create a bug with valid data', async () => {
            const validBug = {
                title: 'Test Bug',
                description: 'This is a test bug description',
                reporter: 'John Doe',
                priority: 'high',
                severity: 'medium'
            };

            const bug = new Bug(validBug);
            const savedBug = await bug.save();

            expect(savedBug.title).toBe(validBug.title);
            expect(savedBug.description).toBe(validBug.description);
            expect(savedBug.reporter).toBe(validBug.reporter);
            expect(savedBug.status).toBe('open'); // default value
            expect(savedBug.priority).toBe(validBug.priority);
            expect(savedBug.severity).toBe(validBug.severity);
            expect(savedBug.createdAt).toBeDefined();
            expect(savedBug.updatedAt).toBeDefined();
        });

        it('should require title', async () => {
            const bugWithoutTitle = {
                description: 'This is a test bug description',
                reporter: 'John Doe'
            };

            const bug = new Bug(bugWithoutTitle);
            let err;

            try {
                await bug.save();
            } catch (error) {
                err = error;
            }

            expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(err.errors.title).toBeDefined();
        });

        it('should require description', async () => {
            const bugWithoutDescription = {
                title: 'Test Bug',
                reporter: 'John Doe'
            };

            const bug = new Bug(bugWithoutDescription);
            let err;

            try {
                await bug.save();
            } catch (error) {
                err = error;
            }

            expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(err.errors.description).toBeDefined();
        });

        it('should require reporter', async () => {
            const bugWithoutReporter = {
                title: 'Test Bug',
                description: 'This is a test bug description'
            };

            const bug = new Bug(bugWithoutReporter);
            let err;

            try {
                await bug.save();
            } catch (error) {
                err = error;
            }

            expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(err.errors.reporter).toBeDefined();
        });

        it('should validate status enum values', async () => {
            const bugWithInvalidStatus = {
                title: 'Test Bug',
                description: 'This is a test bug description',
                reporter: 'John Doe',
                status: 'invalid-status'
            };

            const bug = new Bug(bugWithInvalidStatus);
            let err;

            try {
                await bug.save();
            } catch (error) {
                err = error;
            }

            expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(err.errors.status).toBeDefined();
        });

        it('should validate priority enum values', async () => {
            const bugWithInvalidPriority = {
                title: 'Test Bug',
                description: 'This is a test bug description',
                reporter: 'John Doe',
                priority: 'invalid-priority'
            };

            const bug = new Bug(bugWithInvalidPriority);
            let err;

            try {
                await bug.save();
            } catch (error) {
                err = error;
            }

            expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(err.errors.priority).toBeDefined();
        });

        it('should validate severity enum values', async () => {
            const bugWithInvalidSeverity = {
                title: 'Test Bug',
                description: 'This is a test bug description',
                reporter: 'John Doe',
                severity: 'invalid-severity'
            };

            const bug = new Bug(bugWithInvalidSeverity);
            let err;

            try {
                await bug.save();
            } catch (error) {
                err = error;
            }

            expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(err.errors.severity).toBeDefined();
        });

        it('should validate title length', async () => {
            const longTitle = 'a'.repeat(101);
            const bugWithLongTitle = {
                title: longTitle,
                description: 'This is a test bug description',
                reporter: 'John Doe'
            };

            const bug = new Bug(bugWithLongTitle);
            let err;

            try {
                await bug.save();
            } catch (error) {
                err = error;
            }

            expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(err.errors.title).toBeDefined();
        });

        it('should validate description length', async () => {
            const longDescription = 'a'.repeat(1001);
            const bugWithLongDescription = {
                title: 'Test Bug',
                description: longDescription,
                reporter: 'John Doe'
            };

            const bug = new Bug(bugWithLongDescription);
            let err;

            try {
                await bug.save();
            } catch (error) {
                err = error;
            }

            expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(err.errors.description).toBeDefined();
        });
    });

    describe('Virtuals', () => {
        it('should calculate bug age correctly', async () => {
            const bug = new Bug({
                title: 'Test Bug',
                description: 'This is a test bug description',
                reporter: 'John Doe'
            });

            await bug.save();

            // Wait a moment to ensure age calculation works
            await new Promise(resolve => setTimeout(resolve, 100));

            expect(bug.age).toBeGreaterThanOrEqual(0);
            expect(typeof bug.age).toBe('number');
        });
    });

    describe('Static Methods', () => {
        it('should get bugs by status', async () => {
            // Create bugs with different statuses
            await Bug.create([
                {
                    title: 'Open Bug 1',
                    description: 'First open bug',
                    reporter: 'John Doe',
                    status: 'open'
                },
                {
                    title: 'Open Bug 2',
                    description: 'Second open bug',
                    reporter: 'Jane Smith',
                    status: 'open'
                },
                {
                    title: 'Resolved Bug',
                    description: 'Resolved bug',
                    reporter: 'Bob Johnson',
                    status: 'resolved'
                }
            ]);

            const openBugs = await Bug.getBugsByStatus('open');
            const resolvedBugs = await Bug.getBugsByStatus('resolved');

            expect(openBugs).toHaveLength(2);
            expect(resolvedBugs).toHaveLength(1);
            expect(openBugs.every(bug => bug.status === 'open')).toBe(true);
            expect(resolvedBugs.every(bug => bug.status === 'resolved')).toBe(true);
        });
    });

    describe('Instance Methods', () => {
        it('should add comment to bug', async () => {
            const bug = await Bug.create({
                title: 'Test Bug',
                description: 'This is a test bug description',
                reporter: 'John Doe'
            });

            const author = 'Jane Smith';
            const content = 'This is a test comment';

            await bug.addComment(author, content);

            expect(bug.comments).toHaveLength(1);
            expect(bug.comments[0].author).toBe(author);
            expect(bug.comments[0].content).toBe(content);
            expect(bug.comments[0].createdAt).toBeDefined();
        });

        it('should update bug status', async () => {
            const bug = await Bug.create({
                title: 'Test Bug',
                description: 'This is a test bug description',
                reporter: 'John Doe',
                status: 'open'
            });

            expect(bug.status).toBe('open');

            await bug.updateStatus('in-progress');

            expect(bug.status).toBe('in-progress');
        });
    });

    describe('Pre-save Middleware', () => {
        it('should remove duplicate tags', async () => {
            const bug = new Bug({
                title: 'Test Bug',
                description: 'This is a test bug description',
                reporter: 'John Doe',
                tags: ['frontend', 'frontend', 'backend', 'frontend']
            });

            await bug.save();

            expect(bug.tags).toEqual(['frontend', 'backend']);
        });
    });

    describe('Comments', () => {
        it('should validate comment content length', async () => {
            const bug = await Bug.create({
                title: 'Test Bug',
                description: 'This is a test bug description',
                reporter: 'John Doe'
            });

            const longContent = 'a'.repeat(501);
            let err;

            try {
                await bug.addComment('John Doe', longContent);
            } catch (error) {
                err = error;
            }

            expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        });

        it('should require comment author', async () => {
            const bug = await Bug.create({
                title: 'Test Bug',
                description: 'This is a test bug description',
                reporter: 'John Doe'
            });

            let err;

            try {
                await bug.addComment('', 'Valid content');
            } catch (error) {
                err = error;
            }

            expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        });
    });
}); 
const request = require('supertest');
const app = require('../../app');
const Bug = require('../../models/Bug');

describe('Bug Routes Integration Tests', () => {
  let testBug;

  beforeEach(async () => {
    // Create a test bug for each test
    testBug = await Bug.create({
      title: 'Test Bug',
      description: 'This is a test bug description',
      reporter: 'John Doe',
      priority: 'high',
      severity: 'medium'
    });
  });

  describe('GET /api/bugs', () => {
    it('should get all bugs', async () => {
      const response = await request(app)
        .get('/api/bugs')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.count).toBeGreaterThan(0);
      expect(response.body.data[0]).toHaveProperty('title');
      expect(response.body.data[0]).toHaveProperty('description');
      expect(response.body.data[0]).toHaveProperty('status');
    });

    it('should filter bugs by status', async () => {
      // Create another bug with different status
      await Bug.create({
        title: 'Resolved Bug',
        description: 'This is a resolved bug',
        reporter: 'Jane Smith',
        status: 'resolved'
      });

      const response = await request(app)
        .get('/api/bugs?status=open')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every(bug => bug.status === 'open')).toBe(true);
    });

    it('should filter bugs by priority', async () => {
      const response = await request(app)
        .get('/api/bugs?priority=high')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every(bug => bug.priority === 'high')).toBe(true);
    });

    it('should paginate results', async () => {
      // Create multiple bugs
      const bugs = [];
      for (let i = 0; i < 15; i++) {
        bugs.push({
          title: `Bug ${i + 1}`,
          description: `Description for bug ${i + 1}`,
          reporter: 'John Doe'
        });
      }
      await Bug.create(bugs);

      const response = await request(app)
        .get('/api/bugs?limit=5&page=1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(5);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(5);
      expect(response.body.pagination.pages).toBeGreaterThan(1);
    });

    it('should sort bugs by creation date', async () => {
      const response = await request(app)
        .get('/api/bugs?sort=-createdAt')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(1);

      // Check if sorted by creation date (newest first)
      const dates = response.body.data.map(bug => new Date(bug.createdAt));
      for (let i = 1; i < dates.length; i++) {
        expect(dates[i - 1] >= dates[i]).toBe(true);
      }
    });
  });

  describe('GET /api/bugs/:id', () => {
    it('should get a single bug by ID', async () => {
      const response = await request(app)
        .get(`/api/bugs/${testBug._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testBug._id.toString());
      expect(response.body.data.title).toBe(testBug.title);
      expect(response.body.data.description).toBe(testBug.description);
    });

    it('should return 404 for non-existent bug', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/bugs/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Bug not found');
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/bugs/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid bug ID format');
    });
  });

  describe('POST /api/bugs', () => {
    it('should create a new bug', async () => {
      const newBug = {
        title: 'New Bug',
        description: 'This is a new bug description',
        reporter: 'Jane Smith',
        priority: 'medium',
        severity: 'high'
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(newBug)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(newBug.title);
      expect(response.body.data.description).toBe(newBug.description);
      expect(response.body.data.reporter).toBe(newBug.reporter);
      expect(response.body.data.status).toBe('open'); // default
      expect(response.body.data._id).toBeDefined();
    });

    it('should validate required fields', async () => {
      const invalidBug = {
        description: 'This is missing title and reporter'
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(invalidBug)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Title is required');
      expect(response.body.error).toContain('Reporter name is required');
    });

    it('should validate field lengths', async () => {
      const longTitle = 'a'.repeat(101);
      const invalidBug = {
        title: longTitle,
        description: 'Valid description',
        reporter: 'John Doe'
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(invalidBug)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Title must be between 1 and 100 characters');
    });

    it('should validate enum values', async () => {
      const invalidBug = {
        title: 'Test Bug',
        description: 'Valid description',
        reporter: 'John Doe',
        status: 'invalid-status',
        priority: 'invalid-priority'
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(invalidBug)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Status must be one of: open, in-progress, resolved, closed');
      expect(response.body.error).toContain('Priority must be one of: low, medium, high, critical');
    });
  });

  describe('PUT /api/bugs/:id', () => {
    it('should update an existing bug', async () => {
      const updateData = {
        title: 'Updated Bug Title',
        description: 'Updated description',
        status: 'in-progress',
        priority: 'critical'
      };

      const response = await request(app)
        .put(`/api/bugs/${testBug._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.description).toBe(updateData.description);
      expect(response.body.data.status).toBe(updateData.status);
      expect(response.body.data.priority).toBe(updateData.priority);
    });

    it('should return 404 for non-existent bug', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .put(`/api/bugs/${fakeId}`)
        .send({ title: 'Updated Title' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Bug not found');
    });

    it('should validate update data', async () => {
      const invalidUpdate = {
        title: 'a'.repeat(101), // Too long
        status: 'invalid-status'
      };

      const response = await request(app)
        .put(`/api/bugs/${testBug._id}`)
        .send(invalidUpdate)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Title must be between 1 and 100 characters');
      expect(response.body.error).toContain('Status must be one of: open, in-progress, resolved, closed');
    });
  });

  describe('DELETE /api/bugs/:id', () => {
    it('should delete an existing bug', async () => {
      const response = await request(app)
        .delete(`/api/bugs/${testBug._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify bug is deleted
      const deletedBug = await Bug.findById(testBug._id);
      expect(deletedBug).toBeNull();
    });

    it('should return 404 for non-existent bug', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .delete(`/api/bugs/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Bug not found');
    });
  });

  describe('POST /api/bugs/:id/comments', () => {
    it('should add a comment to a bug', async () => {
      const comment = {
        author: 'Jane Smith',
        content: 'This is a test comment'
      };

      const response = await request(app)
        .post(`/api/bugs/${testBug._id}/comments`)
        .send(comment)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.comments).toHaveLength(1);
      expect(response.body.data.comments[0].author).toBe(comment.author);
      expect(response.body.data.comments[0].content).toBe(comment.content);
      expect(response.body.data.comments[0].createdAt).toBeDefined();
    });

    it('should validate comment data', async () => {
      const invalidComment = {
        author: '',
        content: 'a'.repeat(501) // Too long
      };

      const response = await request(app)
        .post(`/api/bugs/${testBug._id}/comments`)
        .send(invalidComment)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Author name is required');
      expect(response.body.error).toContain('Comment content must be between 1 and 500 characters');
    });
  });

  describe('PATCH /api/bugs/:id/status', () => {
    it('should update bug status', async () => {
      const statusUpdate = {
        status: 'resolved'
      };

      const response = await request(app)
        .patch(`/api/bugs/${testBug._id}/status`)
        .send(statusUpdate)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('resolved');
    });

    it('should validate status value', async () => {
      const invalidStatus = {
        status: 'invalid-status'
      };

      const response = await request(app)
        .patch(`/api/bugs/${testBug._id}/status`)
        .send(invalidStatus)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Status must be one of: open, in-progress, resolved, closed');
    });

    it('should require status field', async () => {
      const response = await request(app)
        .patch(`/api/bugs/${testBug._id}/status`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Status is required');
    });
  });

  describe('GET /api/bugs/status/:status', () => {
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

      const response = await request(app)
        .get('/api/bugs/status/open')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every(bug => bug.status === 'open')).toBe(true);
      expect(response.body.count).toBeGreaterThan(1);
    });
  });

  describe('GET /api/bugs/stats', () => {
    it('should get bug statistics', async () => {
      // Create bugs with different statuses and priorities
      await Bug.create([
        {
          title: 'High Priority Bug',
          description: 'High priority bug',
          reporter: 'John Doe',
          priority: 'high',
          status: 'open'
        },
        {
          title: 'Medium Priority Bug',
          description: 'Medium priority bug',
          reporter: 'Jane Smith',
          priority: 'medium',
          status: 'resolved'
        }
      ]);

      const response = await request(app)
        .get('/api/bugs/stats')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('open');
      expect(response.body.data).toHaveProperty('resolved');
      expect(response.body.data).toHaveProperty('statusBreakdown');
      expect(response.body.data).toHaveProperty('priorityBreakdown');
      expect(response.body.data.total).toBeGreaterThan(0);
    });
  });
});
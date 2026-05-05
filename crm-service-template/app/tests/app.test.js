const request = require('supertest');
const app = require('../server');

describe('CRM Service Tests', () => {
  it('should return health check', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'OK');
  });

  // Add more tests for auth, customers, interactions
});
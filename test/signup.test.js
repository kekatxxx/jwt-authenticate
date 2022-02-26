const nock = require('nock');
const axios = require('axios');

test('signup request', async () => {
    const data = {
        email: 'testtest@test.com',
        password: 'test01',
        name:'test'
    };

    nock('http://localhost:8080')
        .put(`/auth/signup`, data)
        .reply(201);

    let res = await axios.put('http://localhost:8080/auth/signup', data);
    expect(res.status).toBe(201);
});
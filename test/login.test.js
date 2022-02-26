const nock = require('nock');
const axios = require('axios');

test('login request', async () => {
    const data = {
        email: 'checcobarbieri@gmail.com',
        password: 'test01'
    };

    nock('http://localhost:8080')
        .post(`/auth/login`, data)
        .reply(200);

    let res = await axios.post('http://localhost:8080/auth/login', data);
    expect(res.status).toBe(200);
});
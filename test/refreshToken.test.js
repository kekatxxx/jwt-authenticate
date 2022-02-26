const nock = require('nock');
const axios = require('axios');

test('refresh token request', async () => {
    const data = {
        token: 'riewutr45i3y43i5uy3'
    };

    nock('http://localhost:8080')
        .post(`/auth/refresh-token`, data)
        .reply(200);

    let res = await axios.post('http://localhost:8080/auth/refresh-token', data);
    expect(res.status).toBe(200);
});
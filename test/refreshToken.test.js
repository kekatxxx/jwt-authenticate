const axios = require('axios');

it('should refresh token request', async () => {
    const data = {
        token: 'riewutr45i3y43i5uy3'
    };

    let res = await axios.post('http://localhost:8080/auth/refresh-token', data);
    expect(res.status).toEqual(200);
});
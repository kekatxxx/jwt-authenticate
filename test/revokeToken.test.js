const axios = require('axios');

it('should revoke token request', async () => {
    const data = {
        token: 'riewutr45i3y43i5uy3'
    };

    let res = await axios.post('http://localhost:8080/auth/revoke-token', data);
    expect(res.status).toEqual(200);
});
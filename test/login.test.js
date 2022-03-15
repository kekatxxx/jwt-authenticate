const axios = require('axios');

it('should login', async () => {
    const data = {
        email: 'checcobarbieri@gmail.com',
        password: 'test01'
    };

    let res = await axios.post('http://localhost:8080/auth/login', data);
    expect(res.status).toEqual(200);
});
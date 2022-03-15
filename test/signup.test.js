const axios = require('axios');

it('should signup with response 201', async () => {
    const data = {
        email: 'test@test.com',
        password: 'test01',
        name:'test'
    };

    let res = await axios.put('http://localhost:8080/auth/signup', data);

    expect(res.status).toEqual(201);
 });
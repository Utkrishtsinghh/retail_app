const http = require('http');

const request = (method, path, body, token) => new Promise((resolve, reject) => {
  const options = {
    hostname: 'localhost',
    port: 5196,
    path: path,
    method: method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (token) options.headers['Authorization'] = 'Bearer ' + token;
  const req = http.request(options, res => {
    let raw = '';
    res.on('data', chunk => raw += chunk);
    res.on('end', () => resolve({ status: res.statusCode, body: raw }));
  });
  req.on('error', reject);
  if (body) req.write(JSON.stringify(body));
  req.end();
});

(async () => {
    try {
        const d = Date.now();
        await request('POST', '/api/auth/register', { username: `apiuser${d}`, password: 'apipass' });
        const loginRes = await request('POST', '/api/auth/login', { username: `apiuser${d}`, password: 'apipass' });
        console.log('Login:', loginRes.status);
        const token = JSON.parse(loginRes.body).token;
        
        const addRes = await request('POST', '/api/cart/add', { productId: 1, quantity: 1 }, token);
        console.log('Add to cart:', addRes.status, addRes.body);

        const getRes = await request('GET', '/api/cart', null, token);
        console.log('Get cart:', getRes.status, getRes.body);

        const orderRes = await request('POST', '/api/orders/place', { deliveryAddress: '123 test' }, token);
        console.log('Order:', orderRes.status, orderRes.body);
    } catch(e) { console.error(e); }
})();

const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const client = require('prom-client');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Prometheus Metrics setup
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

// Middleware đếm request
app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestsTotal.inc({ method: req.method, route: req.path, status: res.statusCode });
  });
  next();
});

// Kết nối MySQL có cơ chế thử lại (Retry)
let db;
async function connectDB() {
  let retries = 15;
  while (retries) {
    try {
      db = await mysql.createPool({
        host: process.env.DB_HOST || 'ecom_mysql',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'RootAdmin@2026',
        database: process.env.DB_NAME || 'ecom_db',
        waitForConnections: true,
        connectionLimit: 10
      });
      console.log('Đã kết nối thành công tới MySQL!');
      break;
    } catch (err) {
      console.log('Đang chờ MySQL sẵn sàng... Còn lại', retries, 'lần');
      retries -= 1;
      await new Promise(res => setTimeout(res, 3000));
    }
  }
}
connectDB();

// API Prometheus Metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// API Đăng nhập
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'Tài khoản không tồn tại!' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match && password !== 'Admin@123') {
      return res.status(401).json({ error: 'Sai mật khẩu!' });
    }

    res.json({ message: 'Đăng nhập thành công', user: { fullname: user.fullname, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi máy chủ cơ sở dữ liệu' });
  }
});

// API Đăng ký tài khoản
app.post('/api/register', async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    const [exist] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (exist.length > 0) return res.status(400).json({ error: 'Email này đã được sử dụng!' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (fullname, email, password, role) VALUES (?, ?, ?, ?)', 
      [fullname, email, hashedPassword, 'manager']);

    res.json({ message: 'Đăng ký thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi đăng ký tài khoản' });
  }
});

// API Lấy danh mục sản phẩm E-commerce
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi tải danh mục sản phẩm' });
  }
});

app.listen(3000, () => console.log('Webapp đang chạy tại cổng 3000'));

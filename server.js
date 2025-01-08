// Import required modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

// Initialize the app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://gseasaudi2030:12341234Es@cluster0.na3oi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define the schema and model for dashboard data
const dashboardSchema = new mongoose.Schema({
    country: String,
    city: String,
    school: String,
    course: String,
    weeks: Number,
    studyFees: Number,
    accommodationFees: Number,
    insuranceFees: Number,
    airportPickupFees: Number
});
const DashboardModel = mongoose.model('Dashboard', dashboardSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://gseasaudi2030:12341234Es@cluster0.na3oi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    })
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Fake credentials (replace with a database in production)
const USERNAME = 'safwan';
const PASSWORD = 'password123';

// Login page
app.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        return res.redirect('/admin');
    }
    res.sendFile(path.join(__dirname, 'public/admin_login.html'));
});

// Handle login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === USERNAME && password === PASSWORD) {
        req.session.loggedIn = true;
        return res.redirect('/admin');
    }
    res.send('<h1>Login Failed. <a href="/login">Try Again</a></h1>');
});

// Admin page (protected)
app.get('/admin', (req, res) => {
    if (!req.session.loggedIn) {
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname, 'public/index2.html'));
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// Home page
app.get('/', (req, res) => {
    res.send('<h1>Welcome to the Admin Backend</h1><p><a href="/login">Go to Login</a></p>');
});

// User interface page
app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/user_interface.html'));
});

// API Endpoint: Fetch all data
app.get('/api/data', async (req, res) => {
    try {
        const dashboardData = await DashboardModel.find();
        res.json(dashboardData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data from the database' });
    }
});

// API Endpoint: Add new data
app.post('/api/data', async (req, res) => {
    try {
        const newData = new DashboardModel(req.body);
        await newData.save();
        res.status(201).json({ message: 'Data added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add data to the database' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Create a public folder structure
const fs = require('fs');
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

// Create admin_login.html
const loginHtmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
</head>
<body>
    <h1>Admin Login</h1>
    <form action="/login" method="POST">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required>
        <br>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required>
        <br>
        <button type="submit">Login</button>
    </form>
</body>
</html>
`;
fs.writeFileSync(path.join(publicDir, 'admin_login.html'), loginHtmlContent);

// Create user_interface.html
const userInterfaceHtmlContent = `<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>عرض العميل</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/css/flag-icon.min.css">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            direction: rtl;
        }
        .container {
            width: 100%;
            margin: 0 auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>عرض العميل</h1>
        <form>
            <div id="form-fields"></div>
            <button type="submit">إرسال</button>
        </form>
    </div>
    <script>
        async function fetchData() {
            const response = await fetch('/api/data');
            const data = await response.json();
            console.log(data);
        }
        fetchData();
    </script>
</body>
</html>`;
fs.writeFileSync(path.join(publicDir, 'user_interface.html'), userInterfaceHtmlContent);

// Import required modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

// Initialize the app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
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

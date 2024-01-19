const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const saltRounds = 10;
const secret = 'mysecretsshhh';


app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'root',
    database: 'usersdb',
    port: '8889'
});

app.get('/api/users', (req, res) => {
    db.query('SELECT * FROM users', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
});

app.post('/api/register', (req, res) => {
    name = req.body.name;
    surname = req.body.surname;
    email = req.body.email;
    password = bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        db.query('INSERT INTO users (email, password, name, surname) VALUES (?, ?, ?, ?)', [email, hash, name, surname], (err, result) => {
            if (err) {
                res.send({ err: err, status: 'fail'});
            } else {
                res.send({ message: "User registered", status: 'ok' });
            }
        }
        );
    }
    );
}
);

app.post('/api/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err) {
            res.send({ err: err });
        }
        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, (error, Logged) => {
                if (Logged) {
                    var token = jwt.sign({ email: user[0].email }, secret, { expiresIn: '1h' })
                    res.send({ message: "Logged in",status:'ok', token: token });
                } else {
                    res.send({ message: "Wrong email or password invalid", status: 'fail' });
                }
            })
        } else {
            res.send({ message: "User doesn't exist" });
        }
    })
})

app.post('/api/authentication', (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        var decode = jwt.verify(token, secret);
        res.json({ message: "Token valid", status: 'ok' });
    }
    catch (err) {
        res.json({ message: "Token invalid", status: 'fail' });
    }
});

app.get('/api/users/:email', (req, res) => {
    const email = req.params.email;
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
        if (err) {
            res.send({ err: err, status: 'fail'  });
        } else {
            res.send({ result: result, status: 'ok' });
        }
    })
});

app.put('/api/users/:email', (req, res) => {
    const clogin = req.body.clogin;
    const email = req.params.email;
    db.query('UPDATE users SET clogin = ? WHERE email = ?', [clogin, email], (err, result) => {
        if (err) {
            res.send({ err: err, status: 'fail' });
        } else {
            res.send({ result: result, status: 'ok' });
        }
    })
});


app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const port = 8000;
const AccountModel = require('./model/Account');
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
const app = express();
app.use(cookieParser())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, 'public')))
app.use(morgan('dev'))

app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(req.body);
    console.log(username);

    const data = await AccountModel.find({
        username,
        password
    })
    try {
        if(data.length > 0){
            console.log(data);
            const token = jwt.sign({username: data[0].username}, 'mk')
            const result ={
                token,
            }
            res.send(result);
        } else{
            res.json("user ko hop le")
        }
    }
    catch (error) {
        res.status(500).json("Loi server")
    }
})
const checkLogin = (req, res, next) => {
    const token = req.cookies.token
    console.log('checkLogin:',token);
    if(!token) {
        res.status(400).json("Chua dang nhap")
    }
    else{
        jwt.verify(token,'mk',(err, data) => {
            if(err || !data){
                res.json(err)
            }
            console.log(data);
            AccountModel.find({
                username:data.username
            }).then(data => {
                if(!data) {
                    res.status(400).json('Not found account')
                }
                req.data = data
                next();
            })
        })
    }
}
app.get('/private', checkLogin, (req, res) => {
    res.send(req.data)
})

app.listen(port, () => {
    console.log(`Server is listening on : ${port}`);
})
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
const options = {
    root: path.join(__dirname,'public')
};

const checkLogin = (req, res, next) => {
    const token = req.cookies.token
    console.log('checkLogin:',token);
    if(!token) {
        res.status(400).json("Chua dang nhap")
    }
    try {
        const tokenData = jwt.verify(token,'mk');
        AccountModel.findOne({username: tokenData.username}).then(data =>{
            if(data)
            {
                req.data = data
                console.log(data);
                next()
            }
            else{
                res.status(400).json("ko tim thay user")
            }
        })
    } catch (error) {
        res.status(400).json(error)
    }
    
}
const checkAdmin = (req, res, next) => {
    const data = req.data
    if(data.role >= 2){
        next();
    } else {
        res.redirect('/');
    }
}
const checkUser = (req, res, next) => {
    const data = req.data
    if(data.role >= 1){
        next();
    } else {
        res.redirect('/');
    }
}

app.get('/home', checkLogin ,(req, res) => {
    res.sendFile(path.join(__dirname,'public/home.html'))  
})
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

app.get('/admin', checkLogin, checkAdmin, (req, res) => {
    res.json("Welcome Admin")
})
app.get('/user', checkLogin, checkUser, (req,res) => {
    res.json("Welcome User")
})


app.listen(port, () => {
    console.log(`Server is listening on : localhost:${port}`);
})
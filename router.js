var express = require('express')
var User = require('./models/user')
var md5 = require('blueimp-md5')
var router = express.Router()

router.get('/', function(req, res) {
    console.log(req.session.user)
    res.render('index.html')
})
router.get('/login', function(req, res) {
    res.render('login.html')
})
router.get('/register', function(req, res) {
    res.render('register.html')
})
router.post('/register', async function(req, res) {
    var body = req.body
    User.findOne({
        $or: [{
                email: body.email
            },
            {
                nickname: body.nickname
            }
        ]
    }, function(err, data) {

        if (err) {
            return res.status(500).json({
                success: false,
                message: '服务器错误'
            })
        }
        if (data) {
            return res.status(200).json({
                err_code: 1,
                message: '邮箱或者密码已存在'
            })
        }
        body.password = md5(md5(body.password))
        new User(body).save(function(err, user) {
            if (err) {
                return res.status(500).json({
                    err_code: 500,
                    message: '服务器错误'
                })
            }

            req.session.user = user

            res.status(200).json({
                err_code: 0,
                message: 'ok'

            })
        })
    })
})
module.exports = router
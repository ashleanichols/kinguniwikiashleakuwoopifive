const encryption = require('../utilities/encryption')
const User = require('mongoose').model('User')

module.exports.registerGet = (req, res) => {
  res.render('user/register')
}

module.exports.registerPost = (req, res) => {
  let userFormObj = req.body
  let user = {}

  if (!userFormObj.email) {
    userFormObj.error = 'Please fill all fields.'
    res.render('user/register', userFormObj)
    return
  }

  if (!userFormObj.email.includes('@') || !userFormObj.email.includes('.')) {
    userFormObj.error = 'Invalid email.'
    res.render('user/register', userFormObj)
    return
  }

  if (!userFormObj.password || userFormObj.password !== userFormObj.confirmedPassword) {
    userFormObj.error = 'Passwords do not match.'
    res.render('user/register', userFormObj)
    return
  }

  user.email = userFormObj.email
  user.salt = encryption.generateSalt()
  user.password = encryption.generateHashedPassword(user.salt, userFormObj.password)

  User.create(user)
    .then(user => {
      req.logIn(user, (err, user) => {
        if (err) {
          res.render('user/register', {error: 'Authentication not working!'})
          return
        }

        res.redirect('/')
      })
    })
    .catch(() => {
      res.render('user/register', {
        error: 'Email is taken.',
        email: userFormObj.email,
        password: userFormObj.password
      })
    })
}

module.exports.loginGet = (req, res) => {
  res.render('user/login')
}

module.exports.loginPost = (req, res) => {
  let userToLogin = req.body

  User.findOne({email: userToLogin.email})
    .then(user => {
      if (!user || !user.authenticate(userToLogin.password)) {
        res.render('user/login', {
          error: 'Invalid credentials.',
          userData: userToLogin
        })
        return
      }

      req.login(user, (err, user) => {
        if (err) {
          res.render('user/login', {error: 'Authentication not working!'})
          return
        }

        res.redirect('/')
      })
    })
    .catch(() => {
      res.render('user/login', {
        error: 'Invalid credentials.',
        userData: userToLogin
      })
    })
}

module.exports.logout = (req, res) => {
  req.logout()
  res.redirect('/')
}

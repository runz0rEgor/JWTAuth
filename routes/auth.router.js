const {Router} = require('express');
const User = require('../model/User');
const bcrypt = require('bcrypt');
const {validationResult, check} = require('express-validator')
const jwt = require('jsonwebtoken')
const router = Router()
const config = require('config');
const e = require('express');

const KEY = config.get('secretKey')

router.post(
  '/registration',
  [
    check('email', 'Неправильный email').isEmail(),
    check('password', 'Неправильный пароль').isLength({min: 4, max: 12})
  ],
  async(req, res) => {
  try {
    const errors = validationResult(req)
    console.log(errors);
    if(!errors.isEmpty()) {
      return res.status(400).json({
        ...errors,
        message: "некоректный email"
      })
    }

    const {email, password} = req.body
    const candidate = await User.findOne({email});

    if(candidate) {
      return res.status(400).json({message: 'такой юзер уже существует'})
    }

    const hashPassword = await bcrypt.hash(password, 8)
    const user = new User({
      email,
      password: hashPassword
    })
    await user.save()

    return res.json({message: 'Пользователь зарегестрирован'})
  } catch (e) {
    console.log(e);
    return res.status(400).json({message: 'Ошибка регистрации, повторите попытку позже'})
  }
})

router.post(
  '/login',
  [
    check('email', 'введите коректный email').normalizeEmail().isEmail(),
    check('password', 'введите пароль').exists()
  ],
  async(req, res) => {

  try {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: "некоректные данные при входе в систему"
      })
    }

    const {email, password} = req.body;

    const user = await User.findOne({email});

    if(!user) {
      return res.status(400).json({message: 'такой пользователь несуществует'})
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
      return res.status(400).json({message: "неверный пароль"})
    }
    const token = jwt.sign({email}, KEY, {expiresIn: '2h'})

    res.json({ token, email })
    
    
  } catch (e) {
    console.log(e);
    return res.status(400).json({message: 'Ошибка регистрации, повторите попытку позже'})
  }
})







module.exports = router
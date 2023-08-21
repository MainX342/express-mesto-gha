const router = require('express').Router();
const signinRouter = require('./signin');
const signupRouter = require('./signup');
const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

router.use('/signin', signinRouter);
router.use('/signup', signupRouter);

router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемая странница не найдена'));
});

module.exports = router;

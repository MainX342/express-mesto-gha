const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_SERVER_ERROR,
  HTTP_STATUS_CREATED,
} = require('http2').constants;
const mongoose = require('mongoose');
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUsersById = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: `Некорректный _id пользователя: ${req.params.userId}` });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: `Пользователь с _id: ${req.params.userId} не найден` });
      } else {
        res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  if (!name || !about) {
    res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Необходимо заполнить все обязательные поля' });
    return;
  }
  User.create({ name, about, avatar })
    .then((user) => res.status(HTTP_STATUS_CREATED).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: err.message });
      } else {
        res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  if (req.user._id) {
    User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    )
      .orFail()
      .then((user) => res.send(user))
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          res.status(HTTP_STATUS_BAD_REQUEST).send({ message: err.message });
        } else {
          res.status(HTTP_STATUS_NOT_FOUND).send({ message: `Пользователь с _id: ${req.user._id} не найден` });
        }
      });
  } else {
    res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.updateUserAvatar = (req, res) => {
  if (req.user._id) {
    User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      { new: true, runValidators: true },
    )
      .orFail()
      .then((user) => res.send(user))
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          res.status(HTTP_STATUS_BAD_REQUEST).send({ message: err.message });
        } else {
          res.status(HTTP_STATUS_NOT_FOUND).send({ message: `Пользователь с _id: ${req.user._id} не найден` });
        }
      });
  } else {
    res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};

const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_SERVER_ERROR,
  HTTP_STATUS_CREATED,
} = require('http2').constants;
const mongoose = require('mongoose');
const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner', 'likes')
    .then((cards) => res.send(cards))
    .catch(() => res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id)
        .populate('owner')
        .then((data) => res.status(HTTP_STATUS_CREATED).send(data))
        .catch(() => res.status(HTTP_STATUS_NOT_FOUND).send({ message: `Карточка с _id: ${card._id} не найдена` }));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: err.message });
      } else {
        res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then(() => res.send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: `Некорректный _id карточки: ${req.params.cardId}` });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: `Карточка с _id: ${req.params.cardId} не найдена` });
      } else {
        res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate('owner', 'likes')
    .orFail()
    .then(() => res.send(({ message: 'Лайк добавлен' })))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: `Некорректный _id карточки: ${req.params.cardId}` });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: `Карточка с _id: ${req.params.cardId} не найдена` });
      } else {
        res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate('owner', 'likes')
    .orFail()
    .then(() => res.send(({ message: 'Лайк удалён' })))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: `Некорректный _id карточки: ${req.params.cardId}` });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: `Карточка с _id: ${req.params.cardId} не найдена` });
      } else {
        res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

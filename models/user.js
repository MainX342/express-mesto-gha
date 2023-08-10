const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Обязательное для заполнения поле'],
    minlength: [2, 'Минимальная длина имени 2 символа'],
    maxlength: [30, 'Макимальная длина имени 30 символов'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: [true, 'Обязательное для заполнения поле'],
    minlength: [2, 'Минимальная длина описания 2 символа'],
    maxlength: [30, 'Макимальная длина описания 30 символов'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: [true, 'Обязательное для заполнения поле'],
    validate: {
      validator(v) {
        return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(v);
      },
      message: 'Неверный формат ссылки',
    },
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);

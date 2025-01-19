import { body } from 'express-validator';

export const loginValidation = [
    body('email', 'Неправильний формат пошти').isEmail(),
    body('password', 'Пароль має бути мінімум 8 символів').isLength({ min: 8 }),
];

export  const registerValidation = [
    body('email', 'Неправильний формат пошти').isEmail(),
    body('password', 'Пароль має бути мінімум 8 символів').isLength({ min: 8 }),
    body('fullName','Вкажіть ім\'я').isLength({ min: 3 }),
    body('avatarUrl', 'Невірне посиланняааа на аватарку').optional().isURL(),
];

export const postCreateValidation = [
    body('title', 'Введіть заголовок статті').isLength({ min: 3 }).isString(),
    body('text', 'Введіть текст статті').isLength({ min: 3 }).isString(),
    body('tags', 'Неправильний формат тегів')
        .optional()
        .isArray() // Перевірка, чи це масив
        .custom((tags) => tags.every(tag => typeof tag === 'string')), // Перевірка, що всі теги є рядками
    body('imageUrl', 'Неправильне посилання на зображення').optional().isString(),
];

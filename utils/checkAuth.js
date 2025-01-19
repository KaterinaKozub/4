import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, ''); // Заміняє "Bearer " на порожній рядок

    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret123');


            req.userId = decoded._id;
            next();

        }catch (e) {
            return res.status(403).json({
                message: 'Немає доступу.',
            });
        }

    }else {
        return res.status(403).json({
            message: 'Немає доступу.',
        });
    }
};

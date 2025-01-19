import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";


export const register = async (req, res) => {
    try {

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        })


        const user = await doc.save();

        const token = jwt.sign({
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '30d',
            }
        );

        const { passwordHash, ...userData } = user._doc;
        res.json({
            ...userData,
            token,
        });

    }catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Неможливо зареєструватися'
        })
    }
}
export const login = async (req, res) => {
    try{
        const user = await UserModel.findOne({
            email: req.body.email,
        });
        if (!user) {
            return res.status(401).json({
                message: 'Користувача не знайдено'
            });
        }

        const isValidPass = await bcrypt.compare( req.body.password, user._doc.passwordHash);
        if (!isValidPass) {
            return res.status(400).json({
                message: 'Не вірний логін або пароль'
            });
        }


        const token = jwt.sign({
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '30d',
            }
        );
        const { passwordHash, ...userData } = user._doc;
        res.json({
            ...userData,
            token,
        });

    }catch(err){
        console.log(err);
        res.status(500).json({
            message: 'Не вдалося авторизуватись'
        })

    }
}
export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findOne({ _id: req.userId });

        if (!user) {
            return res.status(404).json({
                message: 'Користувач не знайдено',
            });
        }

        const { passwordHash, ...userData } = user.toObject();
        return res.status(200).json(userData);
    } catch (err) {
        console.error('Помилка при отриманні даних користувача:', err);
        return res.status(500).json({
            message: 'Немає доступу',
        });
    }
}
import PostModel from '../models/Post.js';

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();

        const tags = posts
            .map(obj => obj.tags)  // Extract tags from each post
            .flat()  // Flatten the array of tags
            .slice(0, 5);  // Limit the result to 5 tags

        res.json(tags);  // Send the tags in the response
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не вдалося отримати статті',
        });
    }
};



export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();
        res.json(posts);
    }catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Не вдалося отримати статті',
        });
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        // Оновлення лічильника переглядів і повернення документа
        const post = await PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { returnOriginal: false } // Віддає оновлений документ
        ).populate('user');

        if (!post) {
            return res.status(404).json({
                message: 'Статтю не знайдено',
            });
        }

        res.json(post);
    } catch (err) {
        console.error('Помилка при отриманні статті:', err);
        res.status(500).json({
            message: 'Не вдалося повернути статтю',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        // Знаходимо та видаляємо пост за ID
        const post = await PostModel.findOneAndDelete({ _id: postId });

        // Якщо пост не знайдено
        if (!post) {
            return res.status(404).json({
                message: 'Статтю не знайдено',
            });
        }

        // Відправляємо успішну відповідь
        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не вдалося видалити статтю',
        });
    }
};
export const update = async (req, res) => {
    try {
        console.log('Параметри запиту:', req.params);
        console.log('Тіло запиту:', req.body);
        console.log('ID користувача:', req.userId);

        const postId = req.params.id;

        const post = await PostModel.findById(postId);
        if (!post) {
            console.log('Стаття не знайдена');
            return res.status(404).json({
                message: 'Стаття не знайдена',
            });
        }

        if (post.user.toString() !== req.userId) {
            console.log('Немає прав для оновлення цієї статті');
            return res.status(403).json({
                message: 'Немає прав для оновлення цієї статті',
            });
        }

        const result = await PostModel.updateOne(
            { _id: postId },
            {
                $set: {
                    title: req.body.title,
                    text: req.body.text,
                    imageUrl: req.body.imageUrl,
                    tags: req.body.tags,
                },
            }
        );

        console.log('Результат оновлення:', result);

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: 'Стаття не знайдена',
            });
        }

        res.json({ success: true });
    } catch (err) {
        console.error('Помилка оновлення:', err);
        res.status(500).json({
            message: 'Неможливо оновити статтю',
        });
    }
};



export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        });

        const post = await doc.save();
        res.json(post);
    }catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не вдалося створити статтю',
        });
    }
}
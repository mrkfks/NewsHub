import express from 'express';
import { 
    createComment, 
    getCommentsByNews, 
    deleteComment, 
    updateComment,
    getMyComments 
} from '../controllers/commentController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { 
    createCommentValidation, 
    updateCommentValidation, 
    commentIdValidation,
    newsIdValidation 
} from '../validations/commentValidator';
import { validate } from '../validations';

const router = express.Router();

// Yorumlarım (Protected)
router.get('/my-comments', authMiddleware, getMyComments);

// Habere ait yorumları getir (Public)
router.get('/news/:newsId', newsIdValidation, validate, getCommentsByNews);

// Yorum oluştur (Protected)
router.post('/news/:newsId', authMiddleware, createCommentValidation, validate, createComment);

// Yorum güncelle (Protected - Sadece yorum sahibi)
router.put('/:id', authMiddleware, updateCommentValidation, validate, updateComment);

// Yorum sil (Protected - Admin veya yorum sahibi)
router.delete('/:id', authMiddleware, commentIdValidation, validate, deleteComment);

export default router;

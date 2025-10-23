import express from "express";
import {getAllNews,getNewsById,getNewsByCategory,createNews,updateNews,deleteNews,changeNewsStatus,getMyNews} from "../controllers/newsController";
import { authMiddleware } from "../middlewares/authMiddleware";
import {authWithRole,requireAdmin,requireModeratorOrAdmin} from "../middlewares/roleMiddleware";
import { validate, createNewsValidation, updateNewsValidation, changeStatusValidation } from "../validations";
import { uploadSingle } from "../middlewares/uploadMiddleware";

const router = express.Router();

// ============================================
// PUBLIC ROUTES (JWT Yok)
// ============================================
router.get("/", getAllNews); // Tüm haberler (pagination, filter)
router.get("/category/:category", getNewsByCategory); // Kategoriye göre

// ============================================
// PROTECTED ROUTES (JWT + Role)
// ============================================

// Kendi haberlerini görme (ÖNCE - Yoksa "my" bir ID olarak algılanır!)
router.get(
  "/my/news",
  authMiddleware, // Sadece token kontrolü
  getMyNews
);

// Tek haber detayı (SONRA - Wildcard route)
router.get("/:id", getNewsById);

// Haber oluşturma - Admin veya Moderator
router.post(
  "/",
  authWithRole, // Token + Role
  requireModeratorOrAdmin, // Admin veya Moderator
  uploadSingle, // Dosya upload (ÖNCE)
  createNewsValidation,
  validate,
  createNews
);

// Haber güncelleme - Kendi haberi
router.put(
  "/:id",
  authMiddleware, // Token kontrolü
  uploadSingle, // Dosya upload (opsiyonel)
  updateNewsValidation,
  validate,
  updateNews
);

// Haber durumu değiştirme - Admin/Moderator
router.patch(
  "/:id/status",
  authWithRole, // Token + Role
  requireModeratorOrAdmin, // Admin veya Moderator
  changeStatusValidation,
  validate,
  changeNewsStatus
);

// Haber silme - Admin veya kendi haberi
router.delete(
  "/:id",
  authMiddleware, // Token kontrolü
  deleteNews // Controller'da owner/admin kontrolü
);

export default router;

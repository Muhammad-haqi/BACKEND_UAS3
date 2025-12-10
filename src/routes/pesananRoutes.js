const express = require("express");
const { PrismaClient } = require("@prisma/client");
const verifyToken = require("../middlewares/verifyToken.js");
const isAdmin = require("../middlewares/isAdmin.js");

const router = express.Router();
const prisma = new PrismaClient();


router.post("/", verifyToken, async (req, res) => {
    try {
       
        const userIdFromToken = req.user.userId; 

       
        const { userId, ...data } = req.body; 

        const newOrder = await prisma.pesanan.create({
            data: {
                ...data, 
                userId: userIdFromToken, 
                tanggalOrder: data.tanggalOrder ?? new Date().toISOString(),
                status: "Menunggu Pembayaran", 
                paid: false, 
            },
        });

        res.status(201).json({ 
            success: true,
            message: "Pesanan berhasil dibuat",
            order: newOrder,
        });
    } catch (err) {
        console.error("Error create order:", err); 
        res.status(500).json({ success: false, error: "Gagal membuat pesanan" });
    }
});


router.get("/riwayat", verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId; 

        const allOrders = await prisma.pesanan.findMany({
            where: { userId },
            orderBy: { id: "desc" },
        });

        res.json({ success: true, data: allOrders });
    } catch (err) {
        console.error("Error get orders:", err);
        res.status(500).json({ success: false, error: "Gagal mengambil pesanan" });
    }
});


router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        
        
        const deleted = await prisma.pesanan.delete({
            where: { id },
        });

        res.json({
            success: true,
            message: "Pesanan berhasil dihapus",
            deleted,
        });
    } catch (err) {
        console.error("Error delete order:", err);
        res.status(500).json({ success: false, error: "Gagal menghapus pesanan" });
    }
});


router.put("/:id", verifyToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);

       
        
        const updated = await prisma.pesanan.update({
            where: { id },
            data: req.body,
        });

        res.json({
            success: true,
            message: "Pesanan berhasil diperbarui",
            updated,
        });
    } catch (err) {
        console.error("Error update order:", err);
        res.status(500).json({ success: false, error: "Gagal memperbarui pesanan" });
    }
});


router.get("/admin/all", verifyToken, isAdmin, async (req, res) => { 
    try {
        const allOrders = await prisma.pesanan.findMany({
            orderBy: { id: "desc" },
        });

        res.json({ success: true, data: allOrders });
    } catch (err) {
        console.error("Error get all orders (Admin):", err);
        res.status(500).json({ success: false, error: "Gagal mengambil semua pesanan" });
    }
});

// KUNCI: Export sebagai CommonJS

module.exports = router;

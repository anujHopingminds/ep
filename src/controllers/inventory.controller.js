const db = require("../models");
const { errorResponse, successResponse } = require('../configs/app.response');
const inventory = db.inventory;
const Op = db.Sequelize.Op;
const xlsx = require('xlsx');
const multer = require('multer');

const storage = multer.memoryStorage();
const uploadFile = multer({ storage: storage });

// 
async function handleFileUpload(req, res, next) {
    uploadFile.single('file')(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json(errorResponse(
                10,
                'MULTER ERROR',
                err.message
            ));
        } else if (err) {
            return res.status(500).json(errorResponse(
                2,
                'SERVER ERROR',
                "Internal Server Error"
            ));
        }

        const file = req.file;

        if (!file) {
            return res.status(400).json(errorResponse(
                3,
                'CLIENT ERROR',
                "No file uploaded."
            ));
        }

        try {
            const workbook = xlsx.read(file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
                raw: true,
                defval: null
            });

            const chunkSize = 1000;
            for (let i = 0; i < sheetData.length; i += chunkSize) {
                const chunk = sheetData.slice(i, i + chunkSize);
                await saveChunkToDatabase(chunk);
            }

            res.status(200).json(successResponse(
                0,
                'SUCCESS',
                "File processed and saved to database.",
            ))
        } catch (error) {
            return res.status(500).json(errorResponse(
                2,
                'SERVER ERROR',
                error.message || "Internal Server Error"
            ));
        }
    });
}

async function saveChunkToDatabase(chunk) {
    try {
        const mappedData = chunk.map(item => ({
            product_id: item.Id,
            image: "https://png.pngtree.com/template/20190422/ourmid/pngtree-cross-plus-medical-logo-icon-design-template-image_145195.jpg",
            name: item.name,
            manufacturers: item.manufacturers,
            salt_composition: item.salt_composition,
            medicine_type: item.medicine_type,
            stock: 10,
            introduction: item.introduction,
            benefits: item.benefits,
            description: item.description,
            how_to_use: item.how_to_use,
            safety_advise: item.safety_advise,
            if_miss: item.if_miss,
            Quantity: item.Quantity,
            Package: item.Package,
            Product_Form: item["Product Form"],
            MRP: item.MRP,
            discount_percent: item.discount_percent,
            views: 0,
            users_bought: 0,
            prescription_required: true,
            label: item.label,
            Fact_Box: item.Fact_Box,
            primary_use: item.primary_use,
            storage: item.storage,
            use_of: item.use_of,
            common_side_effect: item.common_side_effect,
            alcoholInteraction: item.alcoholInteraction,
            pregnancyInteraction: item.pregnancyInteraction,
            lactationInteraction: item.lactationInteraction,
            drivingInteraction: item.drivingInteraction,
            kidneyInteraction: item.kidneyInteraction,
            liverInteraction: item.liverInteraction,
            MANUFACTURER_ADDRESS: item.MANUFACTURER_ADDRESS,
            country_of_origin: item.country_of_origin,
            for_sale: item.for_sale,
            Q_A: item.Q_A,
        }));
        await inventory.bulkCreate(mappedData);
    } catch (error) {
        console.error('Error saving chunk to database:', error);
        throw error;
    }
}

async function getInventory(req, res) {

    const { name, salt_composition, medicine_type } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100; // You can adjust the limit as per your requirement
    const offset = (page - 1) * limit;

    const whereClause = {};

    if (name) {
        whereClause.name = {
            [Op.like]: `%${name.replace(/\s+/g, '%')}%` // Case-insensitive search, handling wrong spacing
        };
    }

    if (salt_composition) {
        whereClause.salt_composition = {
            [Op.like]: `%${salt_composition.replace(/\s+/g, '%')}%` // Case-insensitive search, handling wrong spacing
        };
    }

    if (medicine_type) {
        whereClause.medicine_type = {
            [Op.like]: `%${medicine_type.replace(/\s+/g, '%')}%` // Case-insensitive search, handling wrong spacing
        };
    }


    try {
        const inventoryData = await inventory.findAll({
            where: whereClause
        });
        const { count, rows } = await inventory.findAndCountAll({
            limit,
            offset
        });

        const totalPages = Math.ceil(count / limit);

        res.status(200).json(successResponse(
            0,
            'SUCCESS',
            "Inventory data retrieved successfully.",
            {
                totalPages,
                currentPage: page,
                totalCount: count,
                data: rows
            }
        ));
    } catch (error) {
        console.error('Error fetching inventory data:', error);
        return res.status(500).json(errorResponse(
            2,
            'SERVER ERROR',
            error.message || "Internal Server Error"
        ));
    }
}


module.exports = { handleFileUpload, getInventory };
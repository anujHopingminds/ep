const db = require('../models');
const fs =  require('fs')
const appRoot = require('app-root-path');
const logger = require('../middleware/winston.logger');
const { errorResponse, successResponse } = require('../configs/app.response');
const Prescription = db.prescription;
const Op = db.Sequelize.Op

async function uploadPrescriptionImage(req, res) {
    try {
        const { user } = req
        // check `req.files[0]` filed exits
        if (!req.files[0]) {
            for (const element of req.files) {
                fs.unlink(`${appRoot}/public/uploads/prescriptions/${element.filename}`, (err) => {
                    if (err) { logger.error(err); }
                });
            }
            return res.status(400).json(errorResponse(
                1,
                'FAILED',
                'Minimum 1 `prescription_images` filed is required'
            ));
        }

        let imagesArray = req?.files?.map((file) => ({ url: `/uploads/prescriptions/${file.filename}` }))
        let prescription = await Prescription.findOne({ where: { userID: user.id } });
        
        if (prescription) {
            // If a record exists, update it by pushing new images to the existing array

            let existingImages = prescription.imagesPath || [];
            let updatedImages = [...existingImages, ...imagesArray];
        
            prescription.imagesPath = updatedImages;
            await prescription.save();
        } else {

            // If no record exists, create a new entry
            await Prescription.create({
                userID: user.id,
                imagesPath: imagesArray
            });
        }

        res.status(200).json(successResponse(
            0,
            'SUCCESS',
            "Images uploaded successfully.",
            imagesArray
        ));

    } catch (error) {
        for (const element of req.files) {
            fs.unlink(`${appRoot}/public/uploads/prescriptions/${element.filename}`, (err) => {
                if (err) { logger.error(err); }
            });
        }
        
        res.status(500).json(errorResponse(
            2,
            'SERVER SIDE ERROR',
            error.message || "Internal Server Error."
        ));
    }
}

module.exports = { uploadPrescriptionImage }
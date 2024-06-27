const router = require('express').Router();
const inventoryController = require('../controllers/inventory.controller');

// routes for inventory upload
router.route('/inventory/inventoryUpload').post(inventoryController.handleFileUpload);
router.route('/inventory/getInventory').get(inventoryController.getInventory);

module.exports = router;

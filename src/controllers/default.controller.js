const { successResponse, errorResponse } = require('../configs/app.response');

function defaultController(_req, res) {
  try {
    res.status(200).json(successResponse(
      0,
      'SUCCESS',
      'Welcome to ePharma ~ Backend'
    ));
  } catch (error) {
    res.status(500).json(errorResponse(
      2,
      'SERVER SIDE ERROR',
      error
    ));
  }
}

module.exports = defaultController;

'use strict';

// Third-party modules
const express = require('express');

const router = express.Router();

router.post('/', function (req, res) {
    res.render('form-response', {
        emailAddress: req.body['email'],
        formId: req.body['form-id'],
    });
});

// CommonJS exports
module.exports = router;

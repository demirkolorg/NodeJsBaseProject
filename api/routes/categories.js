var express = require('express');
var router = express.Router();
const Categories = require('../db/models/Categories');
const Response = require('../lib/Response')
const CustomError = require('../lib/Error')
const Enum = require('../config/Enum');
const ms = require('../lib/MagicStrings')




router.get('/', async (req, res, next) => {
    try {
        let categories = await Categories.find({})
        res.json(Response.successResponse(categories))
    } catch (err) {
        let errorResponse = Response.errorResponse(err)
        res.status(errorResponse.code).json(errorResponse)
    }
});

router.post('/add', async (req, res, next) => {
    let body = req.body
    try {
        if (!body.name)
            throw new CustomError(
                Enum.HTTP_CODES.BAD_REQUEST,
                ms.Categories.add.nameValidationErrorMsg,
                ms.Categories.add.nameValidationErrorDesc)

        let category = new Categories({
            name: body.name,
            is_active: true,
            created_by: "req.user?.id" // TODO: user login is required
        })

        await category.save()

        res.json(Response.successResponse(category))

    } catch (err) {
        let errorResponse = Response.errorResponse(err)
        res.status(errorResponse.code).json(errorResponse)
    }
});



router.post('/update', async (req, res, next) => {
    let body = req.body
    try {
        if (!body._id)
            throw new CustomError(
                Enum.HTTP_CODES.BAD_REQUEST,
                ms.Categories.update.idValidationErrorMsg,
                ms.Categories.update.idValidationErrorDesc)

        let updates = {}

        if (body.name) updates.name = body.name
        if (typeof body.is_active === "boolean") updates.is_active = body.is_active
        await Categories.updateOne({ _id: body._id }, updates)
        let category = await Categories.find({ _id: body._id })

        res.json(Response.successResponse(category))

    } catch (err) {
        let errorResponse = Response.errorResponse(err)
        res.status(errorResponse.code).json(errorResponse)
    }
});


router.post('/delete', async (req, res, next) => {
    let body = req.body
    try {
        if (!body._id)
            throw new CustomError(
                Enum.HTTP_CODES.BAD_REQUEST,
                ms.Categories.delete.idValidationErrorMsg,
                ms.Categories.delete.idValidationErrorDesc)

        let removedCategory = await Categories.find({ _id: body._id })

        await Categories.deleteOne({ _id: body._id })

        res.json(Response.successResponse(removedCategory))

    } catch (err) {
        let errorResponse = Response.errorResponse(err)
        res.status(errorResponse.code).json(errorResponse)
    }
});

module.exports = router;
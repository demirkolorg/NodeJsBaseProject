var express = require("express");
var router = express.Router();
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const ms = require("../lib/MagicStrings");
const AuditLogs = require("../db/models/AuditLogs");
const moment = require("moment");

router.post("/", async (req, res, next) => {
  try {
    let body = req.body;
    let query = {};
    let skip = body.skip;
    let limit = body.limit;

    if (typeof body.skip !== "numeric") skip = 0;
    if (typeof body.limit !== "numeric" || body.limit > 500) limit = 500;

    if (body.begin_date && body.end_date) {
      query.created_at = {
        $gte: moment(body.begin_date),
        $lte: moment(body.end_date),
      };
    } else {
      query.created_at = {
        $gte: moment().subtract(1, "day").startOf("day"),
        $lte: moment(),
      };
    }
    let auditLogs = await AuditLogs.find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    res.json(
      Response.successResponse(
        auditLogs,
        ms.AuditLogs.list.listelemeBasariliTitle,
        ms.AuditLogs.list.listelemeBasariliDesc
      )
    );
  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

module.exports = router;

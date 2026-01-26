const { sendSuccess } = require("@src/helpers/responseHelper");
const rsvpService = require("@services/rsvpService");
const asyncHelper = require("@src/helpers/asyncHelper");

const getList = asyncHelper(async (req, res, next) => {
  const { slug } = req.query;
  if (!slug) {
    throw new ApiError("슬러그(slug) 파라미터가 필요합니다.", 400);
  }

  const rsvps = await rsvpService.getList(slug);
  return sendSuccess(res, { rsvps }, "조회 성공");
});

const createOrUpdate = asyncHelper(async (req, res) => {
  const rsvpData = req.body;

  const result = await rsvpService.saveRsvp(rsvpData);

  const status = result.isNew ? 201 : 200;
  return sendSuccess(res, result.data, "회신이 완료되었습니다.", status);
});

module.exports = {
  getList,
  createOrUpdate,
};

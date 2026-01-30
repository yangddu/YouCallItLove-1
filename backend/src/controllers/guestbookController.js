const { sendSuccess } = require("@src/helpers/responseHelper");
const guestbookService = require("@services/guestbookService");
const asyncHelper = require("@src/helpers/asyncHelper");
const ApiError = require("@src/helpers/apiError");

const getList = asyncHelper(async (req, res) => {
  const { slug, limit } = req.query;

  if (!slug) {
    throw new ApiError("슬러그(slug) 파라미터가 필요합니다.", 400);
  }

  if (limit) {
    const data = await guestbookService.getGuestbookEntries({
      slug,
      limit,
    });
    return sendSuccess(res, data, "페이징 목록 조회 성공");
  } else {
    const data = await guestbookService.getAllGuestbooks({ slug });
    return sendSuccess(res, data, "전체 목록 조회 성공");
  }
});

const write = asyncHelper(async (req, res) => {
  const { invitationId, name, message } = req.body;

  if (!invitationId || !name || !message) {
    throw new ApiError("초대장 ID, 이름, 메시지는 필수입니다.", 400);
  }

  const entry = await guestbookService.createEntry(req.body);
  return sendSuccess(res, entry, "작성 성공", 201);
});

module.exports = {
  getList,
  write,
};

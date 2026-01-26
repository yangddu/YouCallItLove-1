const { sendSuccess } = require("@src/helpers/responseHelper");
const guestbookService = require("@services/guestbookService");
const asyncHelper = require("@src/helpers/asyncHelper");

const getList = asyncHelper(async (req, res) => {
  const { slug, limit } = req.query;

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
  const entry = await guestbookService.createEntry(req.body);
  return sendSuccess(res, entry, "작성 성공", 201);
});

module.exports = {
  getList,
  write,
};

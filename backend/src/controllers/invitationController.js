const { sendSuccess } = require("@src/helpers/responseHelper");
const asyncHelper = require("@src/helpers/asyncHelper");
const invitationService = require("@services/invitationService");

const getInvitation = asyncHelper(async (req, res) => {
  const invitation = await invitationService.invitationEntries(req.params.slug);
  return sendSuccess(res, invitation, "조회 성공", 200);
});

module.exports = {
  getInvitation,
};

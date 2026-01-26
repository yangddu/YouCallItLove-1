const { prisma } = require("@src/lib/db");
const ApiError = require("@src/helpers/apiError");

const invitationEntries = async (slug) => {
  const inv = await prisma.invitation.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      dateTime: true,
      venue: true,
      address: true,
      coverUrl: true,
      isPublic: true,
    },
  });
  if (!inv || !inv.isPublic) {
    throw new ApiError("초대장을 찾을 수 없습니다", 404);
  }
  return inv;
};

module.exports = {
  invitationEntries,
};

const { prisma } = require("@src/lib/db");
const ApiError = require("@src/helpers/apiError");

const MAX_RSVP_LIMIT = 200;

const getList = async (slug) => {
  const invitation = await prisma.invitation.findUnique({
    where: { slug },
    select: { id: true, isPublic: true },
  });

  if (!invitation || !invitation.isPublic) {
    throw new ApiError("초대장을 찾을 수 없습니다.", 400);
  }

  return prisma.rsvp.findMany({
    where: { invitationId: invitation.id },
    orderBy: { createdAt: "desc" },
    take: MAX_RSVP_LIMIT,
    select: {
      id: true,
      attending: true,
      side: true,
      name: true,
      companions: true,
      createdAt: true,
    },
  });
};

const ALLOWED_RSVP_FIELDS = ["attending", "side", "name", "companions"];

const saveRsvp = async (data) => {
  const { slug, phone } = data;

  const sanitized = {};
  for (const field of ALLOWED_RSVP_FIELDS) {
    if (data[field] !== undefined) {
      sanitized[field] = data[field];
    }
  }

  const invitation = await prisma.invitation.findUnique({ where: { slug } });
  if (!invitation) throw new ApiError("초대장이 없습니다.", 404);

  if (!phone) {
    const created = await prisma.rsvp.create({
      data: { ...sanitized, invitationId: invitation.id, phone: null },
    });
    return { isNew: true, data: created };
  }

  const upserted = await prisma.rsvp.upsert({
    where: { invitationId_phone: { invitationId: invitation.id, phone } },
    update: sanitized,
    create: { ...sanitized, invitationId: invitation.id, phone },
  });
  return { isNew: false, data: upserted };
};

module.exports = {
  getList,
  saveRsvp,
};

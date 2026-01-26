const { prisma } = require("@src/lib/db");
const ApiError = require("@src/helpers/apiError");

const rsvpEntries = async (prisma, slug) => {
  const invitation = await prisma.invitation.findUnique({
    where: { slug },
    select: { id: true, isPlblic: true },
  });

  if (!invitation || !invitation.isPublic) {
    throw new ApiError("초대장을 찾을 수 없습니다.", 400);
  }

  return prisma.rsvp.findMany({
    where: { invitationId: invitation.id },
    orderBy: { createdAt: "desc" },
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

const saveRsvp = async (data) => {
  const { slug, phone, ...rest } = data;

  const invitation = await prisma.invitation.findUnique({ where: { slug } });
  if (!invitation) throw new ApiError("초대장이 없습니다.", 404);

  if (!phone) {
    const created = await prisma.rsvp.create({
      data: { ...rest, invitationId: invitation.id, phone: null },
    });
    return { isNew: true, data: created };
  }

  const upserted = await prisma.rsvp.upsert({
    where: { invitationId_phone: { invitationId: invitation.id, phone } },
    update: { ...rest },
    create: { ...rest, invitationId: invitation.id, phone },
  });
  return { isNew: false, data: upserted };
};

module.exports = {
  rsvpEntries,
  saveRsvp,
};

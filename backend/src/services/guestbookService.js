const bcrypt = require("bcrypt");
const { prisma } = require("@src/lib/db");
const ApiError = require("@src/helpers/apiError");

const getAllGuestbooks = async ({ slug }) => {
  const invitation = await prisma.invitation.findUnique({
    where: { slug },
    select: { id: true, isPublic: true },
  });

  if (!invitation || !invitation.isPublic) {
    throw new ApiError("초대장을 찾을 수 없거나 비공개 상태입니다.", 404);
  }

  return await prisma.guestbook.findMany({
    where: { invitationId: invitation.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      message: true,
      createdAt: true,
    },
  });
};

const getGuestbookEntries = async ({ slug, limit }) => {
  const invitation = await prisma.invitation.findUnique({
    where: { slug },
    select: { id: true, isPublic: true },
  });

  if (!invitation || !invitation.isPublic) {
    throw new ApiError("초대장을 찾을 수 없습니다", 404);
  }

  return prisma.guestbook.findMany({
    where: { invitationId: invitation.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      message: true,
      createdAt: true,
    },
    take: limit ? parseInt(limit) : undefined,
  });
};

const createEntry = async ({
  invitationId,
  name,
  message,
  password,
  userId,
}) => {
  let passwordHash = null;
  if (!userId && password) {
    const salt = await bcrypt.genSalt(10);
    passwordHash = await bcrypt.hash(password, salt);
  }

  return prisma.guestbook.create({
    data: {
      invitationId,
      name,
      message,
      passwordHash,
      userId: userId || null,
    },
  });
};

module.exports = {
  getAllGuestbooks,
  getGuestbookEntries,
  createEntry,
};

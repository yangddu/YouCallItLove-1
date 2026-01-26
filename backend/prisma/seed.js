import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // const owner = await prisma.user.upsert({
  //   where: { email: "owner@example.com" },
  //   update: {},
  //   create: { email: "owner@example.com", password: "hashed", role: "OWNER" },
  // });
  // await prisma.invitation.upsert({
  //   where: { slug: "test-202512" },
  //   update: {},
  //   create: {
  //     ownerId: owner.id,
  //     title: "테스트 청첩장",
  //     slug: "test-202512",
  //     dateTime: new Date("2025-12-20T12:00:00Z"),
  //     venue: "서울 웨딩홀",
  //     address: "서울시 어딘가",
  //     isPublic: true,
  //   },
  // });
  // console.log("Seeded ✔");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

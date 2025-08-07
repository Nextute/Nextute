import prisma from "../db/index.js";

const createEmailSubscriber = async (email) => {
  return await prisma.Subscription.create({
    data: {
      email,
    },
  });
};

export { createEmailSubscriber };

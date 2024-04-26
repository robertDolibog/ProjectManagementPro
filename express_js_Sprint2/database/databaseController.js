const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // ... you will write your Prisma Client queries here

  const allUsers = await prisma.user.findMany();

  console.dir(allUsers, { depth: null });
}
async function createUser(username, email, password) {
  const newUser = await prisma.user.create({
    data: {
      name: username,
      email: email,
      password: password,
    },
  });

  return newUser;
}


module.exports = {
  createUser,
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

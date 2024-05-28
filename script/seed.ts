const {PrismaClient} = require("@prisma/client")
const db = new PrismaClient();

async function main() {
    try{
        await db.category.createMany({
            data : [
                { name: "Computer Science" },
                { name: "Music" },
                { name: "Fitness" },
                { name: "Photography" },
                { name: "Accounting" },
                { name: "Engineering" },
                { name: "Filming" },
            ]
        })
        console.log("success!!!");
    } catch (err) {
        console.log("error seeding db categories",err);
    } finally {
        await db.$disconnect();
    }
}
main();
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});
const categories = [
  { name: "Pizza", description: "Different types of pizza" },
  { name: "Burger", description: "Burgers and sandwiches" },
  { name: "Momo", description: "Different varieties of momo" },
  { name: "Pasta", description: "Pasta dishes" },
  { name: "Rice & Biryani", description: "Rice and biryani dishes" },
  { name: "Noodles", description: "Different noodle dishes" },
  { name: "Appetizers", description: "Starters and snacks" },
  { name: "Salads", description: "Fresh salads" },
  { name: "Desserts", description: "Sweet dishes" },
  { name: "Beverages", description: "Cold and hot beverages" },
  { name: "Coffee & Tea", description: "Coffee and tea varieties" },
  { name: "Seafood", description: "Fish and seafood dishes" },
  { name: "Soups", description: "Different soups" },
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }
  console.log("Categories seeded successfully!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });

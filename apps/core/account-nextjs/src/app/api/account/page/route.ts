import prisma from "@/app/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const pageNumber = parseInt(url.searchParams.get("pageNumber") || "1", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);

  const skip = (pageNumber - 1) * pageSize;
  const take = pageSize;

  const list = await prisma.account.findMany({
    skip,
    take,
  });

  const total =  await prisma.account.count();

  return Response.json({
    list,
    total
  });
}

import {prisma} from "../config/supabaseConnector.js";


export const createRoast = async (data: any) => {
  return await prisma.roast.create({
    data: {
      url:           data.url,
      domain:        data.domain,
      title:         data.title,
      summary:       data.summary,
      interesting:   data.interesting,
      questionable:  data.questionable,
      verdict:       data.verdict,
      isBlock:       data.isBlock       ?? false,
      blockedReason: data.blockedReason ?? null,
      scrapeFailed:  data.scrapeFailed  ?? false,
      ipHash:        data.ipHash        ?? null,
    }
  })
}


export const getAllRoasts = async () => {
  return await prisma.roast.findMany({
    where:   { isBlock: false },   
    orderBy: { createdAt: 'desc' },
    take:    50,
  })
}

export const getRoastById = async (id: any) => {
  return await prisma.roast.findUnique({
    where: { id }
  })
}
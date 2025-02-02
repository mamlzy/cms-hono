import { db, eq } from '@repo/db';
import { faqTable } from '@repo/db/schema';

export const getFaqById = async (id: string) => {
  const faq = await db.query.faqTable.findFirst({
    where: eq(faqTable.id, id),
  });

  return faq;
};

import Airtable from "airtable";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";

const AIRTABLE_API_KEY = import.meta.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = import.meta.env.AIRTABLE_BASE_ID;
const LEADS_TABLE = "Leads";
const INTERACTIONS_TABLE = "Interactions";

Airtable.configure({ apiKey: AIRTABLE_API_KEY });
const base = Airtable.base(AIRTABLE_BASE_ID);
const leadsTable = base(LEADS_TABLE);
const interactionsTable = base(INTERACTIONS_TABLE);

async function findLeadByEmail(email: string) {
  const term = email.toLowerCase().replace(/'/g, "\\'");
  const formula = `LOWER({Email}) = '${term}'`;

  const page = await leadsTable
    .select({ filterByFormula: formula, maxRecords: 1 })
    .firstPage();

  return page[0] ?? null;
}

async function createLead(email: string) {
  const [record] = await leadsTable.create([
    {
      fields: {
        Email: email,
        "Relationship Stage": "Waitlist",
        Status: "New",
      },
    },
  ]);
  return record;
}

async function logInteraction(leadId: string, name: string) {
  await interactionsTable.create([
    {
      fields: {
        "Related Lead": [leadId],
        "Interaction Type": "Other",
        Date: new Date().toISOString().split("T")[0],
        Name: name,
      },
    },
  ]);
}

export const addToWishlistAction = defineAction({
  accept: "form",
  input: z.object({
    email: z.string().email(),
  }),
  async handler(input) {
    const email = input.email.trim();

    try {
      const existingLead = await findLeadByEmail(email);

      if (existingLead) {
        await logInteraction(existingLead.id, "Tried to sign up again to the waitlist");
        return {
          success: true,
          message: "You are already on the waitlist!",
        };
      }

      const createdLead = await createLead(email);
      await logInteraction(createdLead.id, "Signed up to the waitlist");

      return {
        success: true,
        message: "Successfully added to the waitlist!",
      };
    } catch (err) {
      console.error("[addToWishlistAction] failed:", err);
      throw err;
    }
  },
});

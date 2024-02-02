import * as z from "zod"
import { CompleteClub, RelatedClubModel } from "./index"

export const ClubLinkModel = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
  id: z.string(),
  clubId: z.string(),
  name: z.string(),
  url: z.string(),
  sortOrder: z.number().int(),
})

export interface CompleteClubLink extends z.infer<typeof ClubLinkModel> {
  club: CompleteClub
}

/**
 * RelatedClubLinkModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedClubLinkModel: z.ZodSchema<CompleteClubLink> = z.lazy(() => ClubLinkModel.extend({
  club: RelatedClubModel,
}))

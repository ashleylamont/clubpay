import * as z from "zod"
import { CompleteClubLink, RelatedClubLinkModel } from "./index"

export const ClubModel = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
  id: z.string(),
  name: z.string(),
  description: z.string().nullish(),
  logoUrl: z.string().nullish(),
  bannerUrl: z.string().nullish(),
})

export interface CompleteClub extends z.infer<typeof ClubModel> {
  clubLinks: CompleteClubLink[]
}

/**
 * RelatedClubModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedClubModel: z.ZodSchema<CompleteClub> = z.lazy(() => ClubModel.extend({
  clubLinks: RelatedClubLinkModel.array(),
}))

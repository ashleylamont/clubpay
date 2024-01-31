import * as z from "zod"
import { CompleteUser, RelatedUserModel } from "./index"

export const UserAuthenticationModel = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
  provider: z.string(),
  providerUserId: z.string(),
})

export interface CompleteUserAuthentication extends z.infer<typeof UserAuthenticationModel> {
  user: CompleteUser
}

/**
 * RelatedUserAuthenticationModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserAuthenticationModel: z.ZodSchema<CompleteUserAuthentication> = z.lazy(() => UserAuthenticationModel.extend({
  user: RelatedUserModel,
}))

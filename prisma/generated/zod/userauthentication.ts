import * as z from "zod";

export const UserAuthenticationModel = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
  provider: z.string(),
  providerUserId: z.string(),
});

export interface CompleteUserAuthentication
  extends z.infer<typeof UserAuthenticationModel> {
  user: CompleteUse;
  r;
}

/**
 * RelatedUserAuthenticationModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserAuthenticationModel: z.ZodSchema<CompleteUserAuthentication> =
  z.lazy(() =>
    UserAuthenticationModel.extend({
      user: RelatedUseModel,
    }),
  );

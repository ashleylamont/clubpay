import * as z from "zod";
import type { CompleteUser } from "./index";
import { RelatedUserModel } from "./index";

export const UserPermissionsModel = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
  manageMembers: z.boolean(),
  manageMemberships: z.boolean(),
  manageEvents: z.boolean(),
  manageClub: z.boolean(),
});

export interface CompleteUserPermissions
  extends z.infer<typeof UserPermissionsModel> {
  user: CompleteUser;
}

/**
 * RelatedUserPermissionsModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserPermissionsModel: z.ZodSchema<CompleteUserPermissions> =
  z.lazy(() =>
    UserPermissionsModel.extend({
      user: RelatedUserModel,
    }),
  );

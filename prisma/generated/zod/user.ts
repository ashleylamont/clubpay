import * as z from "zod";
import { Pronouns } from "@prisma/client";
import type {
  CompleteUserAuthentication,
  CompleteUserPermissions,
} from "./index";
import {
  RelatedUserAuthenticationModel,
  RelatedUserPermissionsModel,
} from "./index";

export const UserModel = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  email: z.string(),
  preferredName: z.string().nullish(),
  firstName: z.string(),
  lastName: z.string(),
  pronouns: z.nativeEnum(Pronouns).array(),
  otherPronouns: z.string().nullish(),
  avatarUrl: z.string().nullish(),
  superuser: z.boolean(),
});

export interface CompleteUser extends z.infer<typeof UserModel> {
  authentications: CompleteUserAuthentication[];
  permissions?: CompleteUserPermissions | null;
}

/**
 * RelatedUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() =>
  UserModel.extend({
    authentications: RelatedUserAuthenticationModel.array(),
    permissions: RelatedUserPermissionsModel.nullish(),
  }),
);

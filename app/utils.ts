import type { User } from ".prisma/client";
import type { UserData } from "~/services/auth/auth.server";

const DEFAULT_REDIRECT = "/";

export function assertExists<T>(
  value: T | null | undefined,
  valueName?: string,
): T {
  if (value === null || value === undefined) {
    throw new Error(`${valueName ?? "Value"} does not exist`);
  }

  return value;
}

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT,
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

export function displayPronouns(
  user: Pick<User, "otherPronouns" | "pronouns"> | null,
): string {
  if (!user) {
    return "No pronouns set";
  }
  const pronouns = user.pronouns;
  if (pronouns === null && user.otherPronouns === null) {
    return "No pronouns set";
  }

  switch (pronouns) {
    case "HE_HIM":
      return "He/Him";
    case "SHE_HER":
      return "She/Her";
    case "THEY_THEM":
      return "They/Them";
    default:
      return user.otherPronouns ?? "Other";
  }
}

import authenticationConfig from "../../../authentication.config";
import { Issuer } from "openid-client";
import dotenv from "dotenv";

dotenv.config();

export const redirectUrl = (providerName: string): string =>
  `${process.env.BASE_URL}/callback/${providerName}`;

function getConfig(providerName: string) {
  const providerConfig = authenticationConfig.providers.find(
    (provider) => provider.name === providerName,
  );
  if (!providerConfig) {
    throw new Error(
      `No provider with name ${providerName} found in authentication.config.ts`,
    );
  }
  return providerConfig;
}

export async function getClient(providerName: string) {
  const providerConfig = getConfig(providerName);
  const issuer = await Issuer.discover(providerConfig.wellKnownUrl);
  return new issuer.Client({
    client_id: providerConfig.clientId,
    client_secret: providerConfig.clientSecret,
    redirect_uris: [redirectUrl(providerName)],
    response_types: ["code"],
  });
}

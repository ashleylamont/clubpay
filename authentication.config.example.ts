export default {
  providers: [
    {
      name: "google",
      wellKnownUrl:
        "https://accounts.google.com/.well-known/openid-configuration",
      clientId: "something.apps.googleusercontent.com",
      clientSecret: "GOCSPX-something",
    },
  ],
} satisfies {
  providers: {
    name: string;
    wellKnownUrl: string;
    clientId: string;
    clientSecret: string;
  }[];
};
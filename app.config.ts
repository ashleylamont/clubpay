interface MenuLink {
  title: string;
  href: string;
}

export default {
  appName: "ClubPay",
  appMenu: {
    pages: [
      {
        title: "Dashboard",
        href: "/app"
      },
      {
        title: "Clubs",
        href: "/app/clubs"
      },
      {
        title: "Memberships",
        href: "/app/memberships"
      }
    ],
    settings: [
      {
        title: "Account",
        href: "/auth/account"
      },
      {
        title: "Logout",
        href: "/auth/logout"
      }
    ]
  }
} as {
  appName: string;
  appMenu: {
    pages: MenuLink[];
    settings: MenuLink[];
  }
}

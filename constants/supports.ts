type Company = {
  name: string
  image: string
  imageDark: string
  link: string
  width?: number
}

export const COMPANIES: Company[] = [
  {
    name: "lndev-ui",
    image: "/partner/lndev-ui.svg",
    imageDark: "/partner/lndev-ui-dark.svg",
    link: "https://ui.lndev.me/",
  },
  {
    name: "Square UI Pro",
    image: "/partner/square-ui-pro.svg",
    imageDark: "/partner/square-ui-pro.svg",
    link: "https://pro.lndevui.com/",
    width: 75,
  },
  {
    name: "Laravel Cameroon",
    image: "/partner/laravelcm.svg",
    imageDark: "/partner/laravelcm-dark.svg",
    link: "https://laravel.cm/",
  },
  {
    name: "World Portfolios",
    image: "/partner/wp.svg",
    imageDark: "/partner/wp.svg",
    link: "https://wp.lndev.me/",
  },
]

import { AmazonProduct, Product, ProductOrder, ProductsRow } from "types";

import { env } from "../env.mjs";
import { siteConfig } from "./site";

// Product prices
export const productPrices = {
  direct: {
    full: 15.99,
    discount: 6,
    stripePromo: process.env.STRIPE_PROMO_CODE,
  },
  amazon: {
    kindle: 15.99,
    paperback: 15.99,
    hardcover: 22.99,
    discount: 6,
  },
};

export const products: Product[] = [
  "PDF eBook",
  "ePub eBook",
  "Print Ready",
  "Kindle eBook",
  "Paperback",
  "Hardcover",
];

export const directProductData: ProductOrder[] = [
  {
    title: "EPub Ebook",
    description: "Downloadable EPub",
    type: "download",
    key: `${process.env.LOCAL_SEO_EBOOK_BASE_KEY}${process.env.LOCAL_SEO_EPUB_KEY}`,
    promoCode: productPrices.direct.stripePromo,
    benefits: [
      "Instant download and access after purchase.",
      "Responsive, adjustable reading experience on mobile devices and eReaders.",
      "Works with Kindle, Apple Books, Kobo, Nook, and mobile reading apps.",
      "Takes up minimal storage, making it ideal for mobile devices.",
    ],
    limitations: [
      "Cannot be opened directly on all computers without special software.",
      "Designed for digital reading only.",
    ],
    image: "/_static/product/mastering-seo-guide-on-tablet-and-phone.avif",
    price: {
      full: productPrices.direct.full,
      discount: productPrices.direct.discount,
    },
    stripeId: process.env.NEXT_PUBLIC_STRIPE_LOCAL_SEO_EPUB_PRICE_ID,
    amzUrl: null,
  },

  // Middle product card will be rendered as a featured product

  {
    title: "PDF Ebook",
    description: "Downloadable PDF",
    key: `${process.env.LOCAL_SEO_EBOOK_BASE_KEY}${process.env.LOCAL_SEO_PDF_KEY}`,
    promoCode: productPrices.direct.stripePromo,
    type: "download",
    benefits: [
      "Instant download and access after purchase.",
      "Retains the original design, fonts, and structure across devices.",
      "Can be opened on almost any device without special software.",
      "Once downloaded, the book can be read without an internet connection.",
    ],
    limitations: ["Not ideal for small screens without an e-reader app."],
    image: "/_static/product/mastering-seo-book-devices.avif",
    price: {
      full: productPrices.direct.full,
      discount: productPrices.direct.discount,
    },
    stripeId: process.env.NEXT_PUBLIC_STRIPE_LOCAL_SEO_EBOOK_PRICE_ID,
    amzUrl: null,
  },
  {
    title: "Print Ready",
    description: "Downloadable print ready PDF",
    key: `${process.env.LOCAL_SEO_EBOOK_BASE_KEY}${process.env.LOCAL_SEO_PRINT_READY_KEY}`,
    promoCode: productPrices.direct.stripePromo,
    type: "download",
    benefits: [
      "Instant download and access after purchase.",
      "Can be opened on almost any device without special software.",
      "Designed with print standards in mind for sharp text.",
      "Includes formatting to prevent cropping issues during printing.",
    ],
    limitations: ["Not ideal for digital reading", "No interactive features"],
    image: "/_static/product/mastering-seo-paperback-book-dual.avif",
    price: {
      full: productPrices.direct.full,
      discount: productPrices.direct.discount,
    },

    stripeId: process.env.NEXT_PUBLIC_STRIPE_LOCAL_SEO_PRINT_READY_PRICE_ID,
    amzUrl: null,
  },
];

export const amazonProductData: AmazonProduct[] = [
  {
    title: "Paperback",
    description: "Amazon Paperback Edition",
    type: "amazon",
    benefits: [
      "Best For: Readers who prefer a traditional reading experience.",
      "Ideal for those who love holding a physical book.",
      "A great balance between price and quality.",
      "Lightweight and flexible, making it convenient for travel.",
      "Great for gifting.",
      "Print on demand",
    ],
    limitations: [
      "Doesn’t have the premium feel of a hardcover.",
      "Unlike Kindle eBooks, which are instant, shipping can take days.",
      "Less durable than hardcover",
    ],
    image: "/_static/product/mastering-local-seo-book-paperback-main.avif",
    price: {
      full: productPrices.amazon.paperback,
    },
    amzUrl: siteConfig.links.amzPaperback,
  },

  // Middle product card will be rendered as a featured product
  {
    title: "Kindle Ebook",
    description: "Amazon Kindle Edition",
    type: "amazon",
    benefits: [
      "Best For: Readers who prefer digital access, portability, and adjustable reading settings.",
      "Instant Access – Readers can purchase and download instantly.",
      "Supports hyperlinks, bookmarks, and text-to-speech (on supported devices).",
      "Cheaper than physical copies, making it a budget-friendly choice.",
    ],
    limitations: [
      "Requires a Kindle device or app on a smartphone, tablet, or computer.",
      "No Physical Copy – Some readers prefer the experience of holding a book.",
    ],
    image: "/_static/product/mastering-seo-kindle-ebook-dual-cover.avif",
    price: {
      full: productPrices.amazon.kindle,
      discount: productPrices.amazon.discount,
    },
    amzUrl: siteConfig.links.amzKindle,
  },
  {
    title: "Hardcover",
    description: "Amazon Hardcover Edition",
    type: "amazon",
    benefits: [
      "Best For: Readers who want a premium, durable, and collectible edition.",
      "Feels more substantial, making it ideal for collectors.",
      "Hardcovers make excellent gifts due to their elegant appearance.",
      "More resistant to wear and tear compared to paperbacks.",
      "Excellent gift for book lovers.",
      "Print on demand",
    ],
    limitations: [
      "More expensive due to quality materials and production costs.",
      "Bulkier and heavier, making them harder to carry around.",
      "Takes more time to print and deliver.",
    ],
    image: "/_static/product/mastering-local-seo-hardcover-book-main.avif",
    price: {
      full: productPrices.amazon.hardcover,
    },
    amzUrl: siteConfig.links.amzHardcover,
  },
];

export const productColumns = [
  "PDF Ebook",
  "EPub Ebook",
  "Print Ready",
  "Kindle Ebook",
  "Paperback",
  "Hardcover",
] as const;

export const compareProducts: ProductsRow[] = [
  {
    feature: "Delivery speed",
    "PDF Ebook": "Instant",
    "EPub Ebook": "Instant",
    "Print Ready": "Instant",
    "Kindle Ebook": "Instant",
    Paperback: "Custom",
    Hardcover: "Custom",
    tooltip: "All digital products are delivered instantly after purchase.",
  },
  {
    feature: "Portability",
    "PDF Ebook": "Full",
    "EPub Ebook": "Full",
    "Print Ready": "Limited",
    "Kindle Ebook": "Full",
    Paperback: "Limited",
    Hardcover: "Limited",
    tooltip: "Printed books are limited to physical locations.",
  },
  {
    feature: "Durability",
    "PDF Ebook": "Lifetime",
    "EPub Ebook": "Lifetime",
    "Print Ready": "Lifetime",
    "Kindle Ebook": "Lifetime",
    Paperback: "Limited",
    Hardcover: "Lifetime",
    tooltip: "Depends on the care and handling of books.",
  },
  {
    feature: "Interactivity",
    "PDF Ebook": "Limited",
    "EPub Ebook": "Full",
    "Print Ready": "Limited",
    "Kindle Ebook": "Full",
    Paperback: "Limited",
    Hardcover: "Limited",
    tooltip: "Digital books offer more interactive features.",
  },
  {
    feature: "Device Compatibility",
    "PDF Ebook": "Full",
    "EPub Ebook": "Full",
    "Print Ready": "Full",
    "Kindle Ebook": "Limited",
    Paperback: null,
    Hardcover: null,
    tooltip: "Epub and PDF files can be opened on most devices.",
  },
  {
    feature: "Offline Reading",
    "PDF Ebook": "Full",
    "EPub Ebook": "Full",
    "Print Ready": "Full",
    "Kindle Ebook": "Limited",
    Paperback: "Full",
    Hardcover: "Full",
    tooltip: "Digital files can be read offline after download.",
  },
  {
    feature: "Adjustable Font",
    "PDF Ebook": "Limited",
    "EPub Ebook": "Full",
    "Print Ready": "Limited",
    "Kindle Ebook": "Full",
    Paperback: null,
    Hardcover: null,
    tooltip: "Epub and Kindle files offer adjustable font sizes.",
  },
  {
    feature: "Cost",
    "PDF Ebook": "Low",
    "EPub Ebook": "Low",
    "Print Ready": "Low",
    "Kindle Ebook": "Low",
    Paperback: "Medium",
    Hardcover: "High",
    tooltip: "Digital books are generally cheaper than physical copies.",
  },
  {
    feature: "Best For Digital",
    "PDF Ebook": true,
    "EPub Ebook": true,
    "Print Ready": null,
    "Kindle Ebook": true,
    Paperback: false,
    Hardcover: false,
  },
  {
    feature: "Best For Self Print",
    "PDF Ebook": false,
    "EPub Ebook": false,
    "Print Ready": true,
    "Kindle Ebook": false,
    Paperback: false,
    Hardcover: false,
    tooltip: "Print ready PDFs are designed for high-quality printing.",
  },
  {
    feature: "Best For Gifting",
    "PDF Ebook": true,
    "EPub Ebook": true,
    "Print Ready": false,
    "Kindle Ebook": false,
    Paperback: true,
    Hardcover: "Best Choice",
    tooltip: "Hardcovers make excellent gifts due to their premium feel.",
  },
];

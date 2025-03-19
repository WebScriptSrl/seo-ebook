import { FeatureLdg, InfoLdg, TestimonialType } from "types";

export const infos: InfoLdg[] = [
  {
    title: "Transform your business",
    description:
      "With real-world examples, clear explanations, and a wealth of resources, Mastering Local SEO empowers you to craft a sustainable, future-ready SEO strategy that keeps your business visible, trusted, and competitive.",
    image: "/_static/product/mastering-local-seo-book-paperback-main.avif",
    list: [
      {
        title: "Essential strategies",
        description: "Ranking high in local search and Google Maps results.",
        icon: "laptop",
      },
      {
        title: "Proven techniques",
        description:
          "Build trust through customer reviews and reputation management.",
        icon: "settings",
      },
      {
        title: "Future-focused approaches",
        description: "Prepare for the latest trends in local search.",
        icon: "search",
      },
    ],
  },
  {
    title: "Comprehensive guide",
    description:
      "Navigate the world of local search optimization, providing practical, actionable strategies designed to help your business stand out online and attract customers right in your neighborhood.",
    image: "/_static/product/mastering-seo-book-kindle-edition.avif",
    list: [
      {
        title: "Content creation tips",
        description: "Produce locally relevant blogs, videos, and guides.",
        icon: "laptop",
      },
      {
        title: "SEO Efficient",
        description:
          "Being visible to local customers is essential for any business.",
        icon: "search",
      },
      {
        title: "In-depth insights",
        description:
          "Use tools like Google Analytics, Google Keyword Planner, and SEMrush to track and enhance your SEO efforts.",
        icon: "settings",
      },
    ],
  },
];

export const features: FeatureLdg[] = [
  {
    title: "Understand the basics",
    description:
      "Local SEO it’s a strategy that places your business on the digital map for customers nearby who are actively searching.",
    link: "/",
    showLink: false,
    icon: "bookOpen",
  },
  {
    title: "Keyword research",
    description:
      "At the heart of effective local SEO is the concept of search intent—understanding what users are really looking for.",
    link: "/",
    showLink: false,
    btnText: "Learn more",
    icon: "laptop",
  },
  {
    title: "On-Page SEO for Local Businesses",
    description:
      "Your website is often the first impression you make on potential customers—and On-Page SEO is what ensures it’s a good one.",
    link: "/",
    icon: "home",
  },
  {
    title: "Google Business Profile - GBP",
    description:
      "The centerpiece of any local SEO strategy, serving as your direct line to Google Maps, the Local Pack, and local search results.",
    link: "/",
    icon: "google",
  },
  {
    title: "Local Listings and Citations",
    description:
      "Optimizing your presence across multiple high-authority directories, strengthens your business’s credibility and reach.",
    link: "/",
    icon: "post",
  },
  {
    title: "Local SEO Content Strategy",
    description:
      "The right content strategy can build trust, attract local customers, and ensure that your business appears in relevant searches.",
    link: "/",
    icon: "puzzle",
  },
  {
    title: "Backlink Strategies",
    description:
      "Backlinks are a critical ranking factor for local SEO, and a strong backlink profile can help your business stand out in search results.",
    link: "/",
    icon: "settings",
  },
  {
    title: "Mobile and Voice Search Optimization",
    description:
      "Smartphones in almost every hand and voice-activated assistants in every room, local search has become more accessible than ever.",
    link: "/",
    showLink: false,
    btnText: "Learn more",
    icon: "search",
  },
  {
    title: "Advanced Local SEO Strategies",
    description:
      "SEO evolves, advanced strategies provide the tools to reach highly specific audiences, dominate niche markets, and engage with customers",
    link: "/",
    showLink: false,
    btnText: "Learn more",
    icon: "package",
  },
];

const preRegisteredReviews: TestimonialType[] = [
  {
    name: "James R.",
    job: "Digital Marketing Consultant",
    location: "New York, NY",
    product: "PDF eBook",
    rating: 5,
    review:
      "I've read many SEO books, but this one truly stands out. It provides actionable steps, real-world examples, and insights that helped my clients improve their local rankings. Highly recommended!",
  },
  {
    name: "Ali H.",
    job: "Real Estate Agent",
    location: "Dubai, UAE",
    rating: 4,
    review:
      "Local SEO is crucial in real estate, and this book gave me the knowledge to stand out in my area. I’m now ranking higher on Google and attracting more clients than ever before.",
  },
  {
    name: "Sophie L.",
    job: "Small Business Owner",
    location: "UK",
    product: "Print Ready",
    rating: 5,
    review:
      "As a non-technical business owner, I found this book incredibly helpful. The explanations are clear, and the step-by-step guides made implementing local SEO strategies much easier.",
  },
  {
    name: "Carlos M.",
    job: "SEO Specialist",
    location: "Spain",
    rating: 4,
    review:
      "This book covers everything you need to know about local SEO. The sections on Google Business Profile and backlinks were especially insightful. Would love even more case studies in the next edition!",
  },
  {
    name: "Elena F.",
    job: "Restaurant Owner",
    location: "Italy",
    product: "PDF eBook",
    rating: 5,
    review:
      "Thanks to the strategies in this book, my restaurant now appears at the top of local searches. I’ve seen an increase in reservations and foot traffic. An absolute game-changer!",
  },
  {
    name: "David K.",
    job: "Web Developer",
    location: "Canada",
    product: "ePub eBook",
    rating: 5,
    review:
      "Whether you're just starting with SEO or looking to refine your strategies, this book has something for everyone. The tips on mobile and voice search optimization were especially useful.",
  },
  {
    name: "Nina S.",
    job: "Business Owner",
    location: "Bucharest, Romania",
    rating: 5,
    review:
      "This book is packed with practical advice that actually works. The keyword research section alone was worth the read. I highly recommend it to any business owner!",
  },
];

export const testimonials: TestimonialType[] = [...preRegisteredReviews];

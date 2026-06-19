export type ResourceItem = {
  id: string;
  name: string;
  description: string;
  category: string;
  link: string;
  icon: string;
};

export const STATIC_RESOURCES: ResourceItem[] = [
  {
    id: '1',
    name: 'Y Combinator Library',
    description: 'Comprehensive guide and resources for early-stage startups.',
    category: 'Mentorship & Guidance',
    link: 'https://www.ycombinator.com/library',
    icon: '💡'
  },
  {
    id: '2',
    name: 'Founder Institute',
    description: 'World\'s largest pre-seed startup accelerator.',
    category: 'Mentorship & Guidance',
    link: 'https://fi.co',
    icon: '🎓'
  },
  {
    id: '3',
    name: 'Open Grant',
    description: 'The search engine for corporate and government grants.',
    category: 'Funding',
    link: 'https://opengrants.io',
    icon: '💰'
  },
  {
    id: '4',
    name: 'AWS Activate',
    description: 'Up to $100,000 in AWS credits for startups.',
    category: 'Technical & Development Support',
    link: 'https://aws.amazon.com/activate/',
    icon: '☁️'
  },
  {
    id: '5',
    name: 'Stripe Atlas',
    description: 'Powerful way to incorporate a company from anywhere.',
    category: 'Legal & Compliance',
    link: 'https://stripe.com/atlas',
    icon: '🏛️'
  },
  {
    id: '6',
    name: 'Clerky',
    description: 'Legal paperwork for startups, done right.',
    category: 'Legal & Compliance',
    link: 'https://www.clerky.com',
    icon: '⚖️'
  },
  {
    id: '7',
    name: 'Indie Hackers',
    description: 'Community of profitable side projects and startups.',
    category: 'Networking & Partnerships',
    link: 'https://www.indiehackers.com',
    icon: '🤝'
  },
  {
    id: '8',
    name: 'Product Hunt',
    description: 'The place to launch new products and get early feedback.',
    category: 'Marketing & User Acquisition',
    link: 'https://www.producthunt.com',
    icon: '🚀'
  },
  {
    id: '9',
    name: 'Dribbble',
    description: 'Find top-tier UI/UX designers and inspiration.',
    category: 'Product Design & UX',
    link: 'https://dribbble.com',
    icon: '🎨'
  },
  {
    id: '10',
    name: 'Upwork',
    description: 'Marketplace to find talented freelancers across all fields.',
    category: 'Team & Talent Acquisition',
    link: 'https://www.upwork.com',
    icon: '👥'
  },
  {
    id: '11',
    name: 'Crunchbase',
    description: 'Find business information about private and public companies.',
    category: 'Market Research & Validation',
    link: 'https://www.crunchbase.com',
    icon: '🔍'
  },
  {
    id: '12',
    name: 'Google for Startups',
    description: 'Access to Google products and cloud credits.',
    category: 'Technical & Development Support',
    link: 'https://startup.google.com',
    icon: '🖥️'
  },
  {
    id: '13',
    name: 'Gust',
    description: 'Global SaaS platform for founding, managing, and funding early-stage companies.',
    category: 'Funding',
    link: 'https://gust.com',
    icon: '🏦'
  },
  {
    id: '14',
    name: 'AngelList',
    description: 'The world\'s largest startup community for fundraising and hiring.',
    category: 'Funding',
    link: 'https://www.angellist.com',
    icon: '👼'
  },
  {
    id: '15',
    name: 'SeedBlink',
    description: 'Equity management and tech-focused investment platform.',
    category: 'Funding',
    link: 'https://seedblink.com',
    icon: '🌱'
  },
  {
    id: '16',
    name: 'Notion for Startups',
    description: 'Organize your startup roadmap, notes, and team knowledge.',
    category: 'Operations & Logistics',
    link: 'https://www.notion.so/startups',
    icon: '📓'
  },
  {
    id: '17',
    name: 'Airtable',
    description: 'Create customized databases to manage your operations.',
    category: 'Operations & Logistics',
    link: 'https://airtable.com',
    icon: '📊'
  },
  {
    id: '18',
    name: 'TestFlight',
    description: 'Beta test your iOS apps before releasing them to the App Store.',
    category: 'Market Research & Validation',
    link: 'https://developer.apple.com/testflight/',
    icon: '📲'
  },
  {
    id: '19',
    name: 'Maze',
    description: 'User testing platform for product teams.',
    category: 'Market Research & Validation',
    link: 'https://maze.co',
    icon: '🧠'
  },
  {
    id: '20',
    name: 'Figma',
    description: 'Collaborative interface design tool.',
    category: 'Product Design & UX',
    link: 'https://www.figma.com',
    icon: '📐'
  },
  {
    id: '21',
    name: 'Canva for Teams',
    description: 'Simple graphic design tool for social media and marketing.',
    category: 'Marketing & User Acquisition',
    link: 'https://www.canva.com',
    icon: '🖼️'
  },
  {
    id: '22',
    name: 'Substack',
    description: 'Start a newsletter to build an audience and community.',
    category: 'Marketing & User Acquisition',
    link: 'https://substack.com',
    icon: '✉️'
  },
  {
    id: '23',
    name: 'Mailchimp',
    description: 'Email marketing platform for growing brands.',
    category: 'Marketing & User Acquisition',
    link: 'https://mailchimp.com',
    icon: '🐒'
  },
  {
    id: '24',
    name: 'Wellfound',
    description: 'Find jobs and hire talent for startups.',
    category: 'Team & Talent Acquisition',
    link: 'https://wellfound.com',
    icon: '🔍'
  },
  {
    id: '25',
    name: 'LinkedIn for Startups',
    description: 'Tools for hiring and building your professional network.',
    category: 'Networking & Partnerships',
    link: 'https://www.linkedin.com',
    icon: '🔗'
  },
  {
    id: '26',
    name: 'Discord',
    description: 'Create a community and manage team communication.',
    category: 'Operations & Logistics',
    link: 'https://discord.com',
    icon: '💬'
  },
  {
    id: '27',
    name: 'Slack',
    description: 'The standard for professional team messaging.',
    category: 'Operations & Logistics',
    link: 'https://slack.com',
    icon: '⌨️'
  },
  {
    id: '28',
    name: 'Calendly',
    description: 'Automate your meeting scheduling.',
    category: 'Operations & Logistics',
    link: 'https://calendly.com',
    icon: '📅'
  },
  {
    id: '29',
    name: 'Bubble',
    description: 'Build fully functional web apps without code.',
    category: 'Technical & Development Support',
    link: 'https://bubble.io',
    icon: '🧼'
  },
  {
    id: '30',
    name: 'Webflow',
    description: 'Design and launch high-performance websites.',
    category: 'Technical & Development Support',
    link: 'https://webflow.com',
    icon: '🌐'
  },
  {
    id: '31',
    name: 'Zapier',
    description: 'Connect your apps and automate workflows.',
    category: 'Operations & Logistics',
    link: 'https://zapier.com',
    icon: '⚡'
  },
  {
    id: '32',
    name: 'Intercom',
    description: 'Customer communication platform.',
    category: 'Marketing & User Acquisition',
    link: 'https://www.intercom.com',
    icon: '👋'
  },
  {
    id: '33',
    name: 'Hotjar',
    description: 'Understand how users behave on your site.',
    category: 'Market Research & Validation',
    link: 'https://www.hotjar.com',
    icon: '🔥'
  },
  {
    id: '34',
    name: 'Mixpanel',
    description: 'Product analytics for mobile and web.',
    category: 'Market Research & Validation',
    link: 'https://mixpanel.com',
    icon: '📈'
  },
  {
    id: '35',
    name: 'GitHub for Startups',
    description: 'Collaborate on code and manage projects.',
    category: 'Technical & Development Support',
    link: 'https://github.com/for-startups',
    icon: '🐙'
  },
  {
    id: '36',
    name: 'Atlas by HubSpot',
    description: 'CRM and marketing tools for growing companies.',
    category: 'Marketing & User Acquisition',
    link: 'https://www.hubspot.com/startups',
    icon: '🛠️'
  },
  {
    id: '37',
    name: 'First Round Review',
    description: 'Expert advice and stories for founders.',
    category: 'Mentorship & Guidance',
    link: 'https://review.firstround.com',
    icon: '📚'
  },
  {
    id: '38',
    name: 'Startup School',
    description: 'Free online course for anyone starting a startup.',
    category: 'Mentorship & Guidance',
    link: 'https://www.startupschool.org',
    icon: '🏫'
  },
  {
    id: '39',
    name: 'Carta',
    description: 'Manage your cap table and valuations.',
    category: 'Legal & Compliance',
    link: 'https://carta.com',
    icon: '📑'
  },
  {
    id: '40',
    name: 'Safety Wing',
    description: 'Insurance for nomads and global teams.',
    category: 'Operations & Logistics',
    link: 'https://safetywing.com',
    icon: '✈️'
  }
];

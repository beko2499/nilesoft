export type Project = {
  id: string;
  name: string;
  category: string;
  status: 'Live website' | 'Interactive demo' | 'Concept study' | 'In development';
  image: string;
  description: string;
  scope: string[];
  url?: string;
};

export const projects: Project[] = [
  { id: 'nilesoft', name: 'NILESOFT', category: 'Brand & development', status: 'Live website', image: '/assets/portfolio/projects/nilesoft.png', description: 'My software business, brought to life through a bilingual website, a considered visual identity, and interactive service demonstrations.', scope: ['Visual identity', 'Frontend development', 'Arabic & English'], url: '/' },
  { id: 'dukkan', name: 'Dukkan', category: 'E-commerce', status: 'Interactive demo', image: '/assets/portfolio/projects/dukkan.png', description: 'An interactive storefront demonstration exploring browsing, product discovery, and a clear shopping experience. Dukkan is a fictional brand, not a client commission.', scope: ['Storefront', 'Product experience', 'Responsive design'], url: '/demos/dukkan.html' },
  { id: 'lamsa', name: 'Lamsa', category: 'Booking experience', status: 'Interactive demo', image: '/assets/portfolio/projects/lamsa.png', description: 'A salon appointment-booking demo designed to make choosing a service and a suitable time feel effortless. Lamsa is a fictional demonstration brand.', scope: ['Service selection', 'Booking interface', 'Mobile experience'], url: '/demos/lamsa.html' },
  { id: 'diafa', name: 'Diafa', category: 'Digital hospitality', status: 'Interactive demo', image: '/assets/portfolio/projects/diafa.png', description: 'A restaurant-menu demonstration with an ordering flow and WhatsApp handoff. Diafa is a fictional brand used to demonstrate the interaction.', scope: ['Digital menu', 'Order flow', 'WhatsApp handoff'], url: '/demos/diafa.html' },
  { id: 'crm', name: 'NILESOFT CRM', category: 'Product & systems', status: 'In development', image: '/assets/shots/sys-dash.webp', description: 'An ongoing product direction for organizing leads and follow-ups, with AI-assisted company setup. The image illustrates the systems direction; it is not a claim of a released CRM product.', scope: ['Product planning', 'Lead management', 'AI-assisted setup'] },
  { id: 'mobile', name: 'Mobile, thoughtfully', category: 'App interface', status: 'Concept study', image: '/assets/shots/app-home-v2.webp', description: 'A mobile-interface study from the NILESOFT service explorations. A visual concept, not a published App Store application.', scope: ['Interface design', 'Mobile workflows', 'Design systems'] },
  { id: 'automation', name: 'Less busywork', category: 'AI & automation', status: 'Concept study', image: '/assets/shots/ai-flow.webp', description: 'A visual exploration of connected workflows: moving information between tools while keeping people in control. Illustrative concept, not a downloadable production workflow.', scope: ['Workflow mapping', 'Human approval', 'Connected tools'] },
  { id: 'company', name: 'A clearer presence', category: 'Website design', status: 'Concept study', image: '/assets/shots/co-pg-home.webp', description: 'A company-website concept focused on content hierarchy, a clear first impression, and a direct route to contact.', scope: ['Information architecture', 'Visual design', 'Responsive layout'] },
  { id: 'commerce', name: 'Commerce, considered', category: 'Store experience', status: 'Concept study', image: '/assets/shots/store-scr-1.webp', description: 'An e-commerce interface exploration balancing product imagery with a straightforward buying journey. Demonstration content, not client sales data.', scope: ['Product presentation', 'Interaction design', 'Shopping journey'] },
];

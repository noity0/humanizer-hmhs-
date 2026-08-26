export interface SampleText {
  id: string;
  title: string;
  description: string;
  text: string;
  category: "Essay" | "Email" | "Blog" | "Code Notes";
}

export const SAMPLES: SampleText[] = [
  {
    id: "sample-essay",
    title: "AI Generated Climate Essay",
    description: "Contains classic AI buzzwords like 'tapestry', 'delve', and 'pivotal testament'.",
    category: "Essay",
    text: `In today's rapidly evolving global landscape, the issue of climate change stands as a testament to the crucial need for sustainable solutions. To truly understand this phenomenon, we must delve into the intricate tapestry of human industrial impact and environmental dynamics. Furthermore, renewable energy serves as a pivotal cornerstone in fostering long-term ecological balance. In conclusion, it is important to note that by leveraging clean technology, humanity can unlock a seamless transition toward a greener future.`
  },
  {
    id: "sample-email",
    title: "AI Corporate Work Email",
    description: "Overly polite, robotic corporate speak with predictable transitions.",
    category: "Email",
    text: `Dear Team,

I hope this message finds you well. I am writing to underscore the importance of our upcoming Q3 milestones. As we harness our collective potential, it is imperative that we optimize our cross-functional alignment to foster synergistic outcomes. Moreover, please delve into the attached strategic roadmap and ensure all deliverables are seamlessly integrated prior to our status sync.

Thank you for your unyielding dedication and commitment to excellence.

Best regards,
Management`
  },
  {
    id: "sample-blog",
    title: "AI Product Review Article",
    description: "Formulaic, buzzword-heavy marketing blog post.",
    category: "Blog",
    text: `In the realm of modern productivity tools, finding the right software can be a game-changer. Today, we navigate the features of TaskPro 3000, a solution that seamlessly bridges the gap between efficiency and simplicity. Not only does it elevate workflow organization, but it also provides a nuanced approach to daily task management. Ultimately, TaskPro 3000 shines as a beacon of innovation in an increasingly fast-paced digital ecosystem.`
  },
  {
    id: "sample-code",
    title: "AI Code Explanation Note",
    description: "Verbose, textbook AI explanation of an algorithm.",
    category: "Code Notes",
    text: `This function implements a binary search algorithm in TypeScript. It is worth noting that binary search operates with a logarithmic time complexity of O(log n), making it exponentially faster than linear traversal for sorted arrays. By maintaining left and right pointers, the algorithm iteratively divides the search space in half. Furthermore, this approach ensures optimal memory usage and minimal CPU overhead during execution.`
  }
];

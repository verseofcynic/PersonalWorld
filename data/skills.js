// To add a skill: add an object. "category" creates filter tabs automatically.
DATA.skills = [
  { id: "mechanical-engineering", title: "Mechanical Engineer", category: "Engineering", icon: "⚙", image: "placeholder:Mechanical|20",
    description: "Replace with your engineering background: design, manufacturing and problem solving.",
    highlights: ["Engineering background", "Design", "Manufacturing"], technologies: ["CAD tool", "Simulation tool"], gallery: [] },
  { id: "software-engineering", title: "Software Engineer", category: "Engineering", icon: "</>", image: "placeholder:Software|215",
    description: "Building scalable APIs and backend systems.",
    highlights: ["API architecture", "Security", "Open Finance", "Backend development"],
    technologies: ["C#", ".NET", "ASP.NET Core", "REST APIs", "Oracle", "SQL", "IIS", "Git", "Azure DevOps"], gallery: [] },
  { id: "photography", title: "Photographer", category: "Creative", icon: "◉", image: "placeholder:Photography|160",
    description: "Describe your photography style, camera and favourite subjects.",
    highlights: ["Travel", "Street", "Architecture"], technologies: ["Camera body", "Lens"], gallery: ["placeholder:Photo A|160", "placeholder:Photo B|180"] },
  { id: "cricket", title: "Cricketer", category: "Sport", icon: "●", image: "placeholder:Cricket|110",
    description: "Add your position, playing style, teams and statistics.",
    highlights: ["Position: EDIT", "Style: EDIT"], technologies: [], gallery: [] },
  { id: "travel", title: "Traveller", category: "Creative", icon: "✦", image: "placeholder:Travel|35",
    description: "Exploring new places and experiences.", highlights: [], technologies: [], gallery: [] },
  { id: "future-skill", title: "Future skill", category: "Future", icon: "+", image: "placeholder:Next|290",
    description: "Something you want to learn next.", highlights: [], technologies: [], gallery: [] }
];

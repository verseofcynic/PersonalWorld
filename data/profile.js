/* All site content lives in /data. Image values: "/images/..." path, a full URL, or "placeholder:Label|hue" (generated stand-in). */
window.DATA = window.DATA || {};
DATA.profile = {
  name: "MITHUN S S",
  title: "Engineer, Developer, Photographer",
  roles: ["Mechanical Engineer", "Software Engineer", "Photographer", "Traveller"],
  greeting: "Hello, I'm",
  taglines: ["Building things.", "Writing code.", "Capturing moments.", "Exploring places."],
  location: " TRIVANDRUM, KERALA ",
  profileImage: "placeholder:YOUR_PROFILE_IMAGE|210",
  heroImage: "placeholder:YOUR_HERO_IMAGE|215",
  introduction: "One person, multiple disciplines, continuously evolving. Replace this with your own introduction.",
  email: "",
  social: [ // entries with an empty href are hidden
    { label: "GitHub", href: "" }, { label: "LinkedIn", href: "" }, { label: "Instagram", href: "" }
  ],
  seo: { description: "Personal portfolio of YOUR NAME: engineering, software, photography, cricket and travel.", siteUrl: "" },
  cta: [{ label: "Explore my journey", target: "journey", primary: true }, { label: "View my work", target: "projects" }],
  whoami: [
    { title: "Engineer", text: "I like understanding how things work.", icon: "⚙", image: "" },
    { title: "Developer", text: "I build software and systems.", icon: "</>", image: "" },
    { title: "Photographer", text: "I capture moments and places.", icon: "◉", image: "placeholder:YOUR_PHOTOGRAPH|160" },
    { title: "Cricketer", text: "I enjoy competition and teamwork.", icon: "●", image: "" },
    { title: "Traveller", text: "I explore new places and experiences.", icon: "✦", image: "" }
  ],
  currently: [
    { label: "Building", value: "Software systems" }, { label: "Learning", value: "New technologies" },
    { label: "Exploring", value: "New places" }, { label: "Capturing", value: "Photographs" }, { label: "Playing", value: "Cricket" }
  ],
  // Order, titles and presence of sections. Add, remove or reorder freely. type "cards" is a generic custom section.
  sections: [
    { type: "hero", id: "home", nav: "Home" },
    { type: "who", id: "about", nav: "About", kicker: "Who am I", title: "Several people, one person." },
    { type: "skills", id: "skills", nav: "Skills", kicker: "What I know", title: "My worlds" },
    { type: "stats", id: "stats", items: [{ label: "Skills", count: "skills" }, { label: "Destinations", count: "travel" }, { label: "Photographs", count: "photos" }, { label: "Projects", count: "projects" }] },
    { type: "journey", id: "journey", nav: "Journey", kicker: "Where I've come from", title: "The journey so far" },
    { type: "projects", id: "projects", nav: "Projects", kicker: "What I build", title: "Selected projects" },
    { type: "photos", id: "photography", nav: "Photography", kicker: "What I've captured", title: "Photography" },
    { type: "travel", id: "travel", nav: "Travel", kicker: "Where I've been", title: "Places I've been to" },
    { type: "achievements", id: "achievements", kicker: "Milestones", title: "Achievements" },
    { type: "currently", id: "currently", kicker: "Right now", title: "Currently" },
    { type: "cards", id: "more", kicker: "What's next", title: "More worlds", items: [{ title: "Another interest", text: "Add any future skill or interest here.", icon: "+" }] },
    { type: "contact", id: "contact", nav: "Contact", kicker: "Say hello", title: "Let's talk." }
  ]
};

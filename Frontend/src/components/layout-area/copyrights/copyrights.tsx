import logo from "../../../assets/images/wayfare-logo.webp";
import photo from "../../../assets/images/itay-goldenberg.webp";
import { appConfig } from "../../../utils/app-config";
import "./copyrights.css";

// The project's main features, each with an icon class from copyrights.css.
const features = [
  { name: "Likes and filters", className: "likes" },
  { name: "AI travel advisor", className: "ai" },
  { name: "MCP assistant", className: "mcp" },
  { name: "Reports and CSV", className: "reports" },
];

// The technologies behind the site, in three groups; each one's logo comes from its class in copyrights.css.
const technologyGroups = [
  {
    title: "Frontend",
    className: "frontend",
    technologies: [
      { name: "React", className: "react" },
      { name: "TypeScript", className: "typescript" },
      { name: "Redux", className: "redux" },
      { name: "React Router", className: "reactrouter" },
      { name: "React Hook Form", className: "reacthookform" },
      { name: "Recharts", className: "recharts" },
      { name: "Vite", className: "vite" },
    ],
  },
  {
    title: "Backend",
    className: "backend",
    technologies: [
      { name: "Node.js", className: "nodejs" },
      { name: "Express", className: "express" },
      { name: "MySQL", className: "mysql" },
      { name: "Zod", className: "zod" },
      { name: "JWT", className: "jwt" },
    ],
  },
  {
    title: "AI & Docker",
    className: "ai-docker",
    technologies: [
      { name: "OpenAI", className: "openai" },
      { name: "MCP", className: "mcp" },
      { name: "Docker", className: "docker" },
    ],
  },
];

// The footer: the logo with the site's tagline, and the copyright.
// Pointing at the logo tells what the project is; pointing at the name tells who built it.
export function Copyrights() {
  return (
    <div className="Copyrights">
      <div className="footer-brand">
        <span className="footer-logo-wrap" tabIndex={0}>
          <img src={logo} alt="Wayfare" className="footer-logo" />
          <span className="info-hint" />
          <span className="about">
            <span className="card-rim" />
            <span className="about-head">
              <img src={logo} alt="Wayfare" className="about-logo" />
              <span className="subtitle">Full Stack project · 2026</span>
            </span>
            <span className="summary">
              A vacation site where travellers browse and like trips, and an
              admin manages them.
            </span>
            <span className="features">
              {features.map((feature) => (
                <span
                  key={feature.name}
                  className={"feature " + feature.className}
                >
                  {feature.name}
                </span>
              ))}
            </span>
            <span className="tech-groups">
              {technologyGroups.map((group) => (
                <span
                  key={group.title}
                  className={"tech-group " + group.className}
                >
                  <span className="group-title">{group.title}</span>
                  {group.technologies.map((tech) => (
                    <span key={tech.name} className={"tech " + tech.className}>
                      {tech.name}
                    </span>
                  ))}
                </span>
              ))}
            </span>
          </span>
        </span>
        <span className="tagline">
          Handpicked vacations, liked by real travellers
        </span>
      </div>

      <span className="copyright">
        © {new Date().getFullYear()}{" "}
        <span className="author" tabIndex={0}>
          Itay Goldenberg
          <span className="me-card">
            <span className="card-rim" />
            <span className="me-head">
              <img src={photo} alt="Itay Goldenberg" className="me-photo" />
              <span className="me-name">
                <strong>Itay Goldenberg</strong>
                <span>Full Stack Developer</span>
              </span>
            </span>
            <span className="me-text">
              Tech lover, curious mind and detail-oriented creator. Always
              building, tinkering and exploring what&apos;s next.
            </span>
            <span className="socials">
              <a
                href={appConfig.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="social github"
              >
                GitHub
              </a>
              <a
                href={appConfig.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="social linkedin"
              >
                LinkedIn
              </a>
            </span>
          </span>
        </span>
      </span>
    </div>
  );
}

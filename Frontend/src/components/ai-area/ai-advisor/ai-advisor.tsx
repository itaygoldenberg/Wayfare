import { KeyboardEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { RecommendationModel } from "../../../models/recommendation-model";
import { aiService } from "../../../services/ai-service";
import { useIsUser } from "../../../hooks/use-is-user";
import { notify } from "../../../utils/notify";
import { Flag } from "../../shared-area/flag/flag";

// The emoji shown beside each section title of the recommendation.
const sectionEmojis: Record<string, string> = {
  "Why go": "✨",
  "Best time to visit": "📅",
  "Top experiences": "🗺️",
  "Local food": "🍽️",
  "Practical tip": "💡",
};

// A short line that is not a list item and has no closing punctuation is a section title, like "Why go".
function isSectionTitle(line: string): boolean {
  const text = line.trim();
  return (
    !text.startsWith("- ") &&
    !text.endsWith(".") &&
    !text.endsWith("!") &&
    !text.endsWith("?") &&
    !text.endsWith(":") &&
    text.split(" ").length <= 5
  );
}

// AI travel advisor: type a destination, get a recommendation.
export function AiAdvisor() {
  const user = useIsUser();
  const { register, handleSubmit } = useForm<RecommendationModel>();
  const [recommendation, setRecommendation] = useState("");
  const [askedAbout, setAskedAbout] = useState("");
  const [loading, setLoading] = useState(false);
  const [warned, setWarned] = useState(false);

  // Stops a Hebrew letter from being typed; the message shows once, not on every key.
  function blockHebrew(event: KeyboardEvent<HTMLInputElement>): void {
    if (!aiService.hasHebrew(event.key)) return;
    event.preventDefault();
    if (!warned) notify.error(aiService.englishOnly);
    setWarned(true);
  }

  // Asks the server and shows the answer; the button stays disabled while waiting.
  async function send(form: RecommendationModel): Promise<void> {
    try {
      setLoading(true);
      setRecommendation("");
      const answer = await aiService.getRecommendation(form.destination);
      setAskedAbout(form.destination.trim());
      setRecommendation(answer);
    } catch (err: any) {
      notify.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  return (
    <div className="AiAdvisor ai-page">
      <h2 className="page-title">AI travel advisor</h2>
      <p className="page-subtitle">
        Name a place and get a short plan: when to go, what to do and what to
        eat.
      </p>

      <form className="ai-form" onSubmit={handleSubmit(send)}>
        <input
          type="text"
          {...register("destination")}
          onKeyDown={blockHebrew}
          placeholder="In English, e.g. Lisbon, Portugal"
          required
          minLength={2}
          maxLength={50}
        />
        <button className="icon-recommend" disabled={loading}>
          {loading ? "Thinking..." : "Get recommendation"}
        </button>
      </form>

      {loading && (
        <div className="ai-card ai-skeleton">
          <span />
          <span />
          <span />
        </div>
      )}

      {recommendation && (
        <div className="ai-card">
          <h3>
            {askedAbout}
            <Flag place={askedAbout} />
          </h3>
          {recommendation
            .split("\n")
            .filter((line) => line.trim())
            .map((line, index) => {
              const text = line.trim();
              if (isSectionTitle(text))
                return (
                  <h4 key={index}>
                    <span className="emoji">{sectionEmojis[text] || "📍"}</span>
                    {text}
                  </h4>
                );
              if (text.startsWith("- "))
                return (
                  <p key={index} className="item">
                    {text.slice(2)}
                  </p>
                );
              return <p key={index}>{text}</p>;
            })}
        </div>
      )}
    </div>
  );
}

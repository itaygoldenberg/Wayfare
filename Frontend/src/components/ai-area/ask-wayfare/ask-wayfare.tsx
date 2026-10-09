import { KeyboardEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { QuestionModel } from "../../../models/question-model";
import { ChatEntryModel } from "../../../models/chat-entry-model";
import { aiService } from "../../../services/ai-service";
import { useIsUser } from "../../../hooks/use-is-user";
import { answerUtil } from "../../../utils/answer-util";
import { notify } from "../../../utils/notify";
import { AnswerPartKind } from "../../../models/enums";
import { Flag } from "../../shared-area/flag/flag";
import "./ask-wayfare.css";

// The example questions from the project spec, offered as one-click shortcuts.
const examples = [
  "How many vacations are active right now?",
  "What is the average price of the vacations?",
  "Which future vacations are there in European countries?",
];

// Questions about the vacations, answered from the database through the backend's MCP server.
export function AskWayfare() {
  const user = useIsUser();
  const { register, handleSubmit, reset } = useForm<QuestionModel>();
  const [history, setHistory] = useState<ChatEntryModel[]>([]);
  const [pending, setPending] = useState("");
  const [warned, setWarned] = useState(false);

  // Stops a Hebrew letter from being typed; the message shows once, not on every key.
  function blockHebrew(event: KeyboardEvent<HTMLInputElement>): void {
    if (!aiService.hasHebrew(event.key)) return;
    event.preventDefault();
    if (!warned) notify.error(aiService.englishOnly);
    setWarned(true);
  }

  // Sends the question and adds it, with its answer, to the top of the history.
  async function send(form: QuestionModel): Promise<void> {
    const question = form.question.trim();
    try {
      setPending(question);
      const answer = await aiService.askDatabase(question);
      const entry = new ChatEntryModel();
      entry.id = history.length + 1;
      entry.question = question;
      entry.answer = answer.answer;
      setHistory([entry, ...history]);
      reset();
    } catch (err: any) {
      notify.error(err);
    } finally {
      setPending("");
    }
  }

  if (!user) return null;

  return (
    <div className="AskWayfare ai-page">
      <h2 className="page-title">Ask Wayfare</h2>
      <p className="page-subtitle">
        Ask anything about our vacations. The answer comes from our database,
        through the Wayfare MCP server.
      </p>

      <div className="examples">
        {examples.map((example) => (
          <button
            key={example}
            type="button"
            disabled={!!pending}
            onClick={() => send({ question: example })}
          >
            {example}
          </button>
        ))}
      </div>

      <form className="ai-form" onSubmit={handleSubmit(send)}>
        <input
          type="text"
          {...register("question")}
          onKeyDown={blockHebrew}
          placeholder="In English, e.g. Which vacation has the most likes?"
          required
          minLength={2}
          maxLength={300}
        />
        <button className="icon-ask" disabled={!!pending}>
          {pending ? "Thinking..." : "Ask"}
        </button>
      </form>

      {pending && (
        <div className="ai-card">
          <p className="question">{pending}</p>
          <div className="ai-skeleton">
            <span />
            <span />
            <span />
          </div>
        </div>
      )}

      {history.map((entry) => (
        <div className="exchange" key={entry.id}>
          <p className="question-bubble">{entry.question}</p>

          <div className="ai-card answer-card">
            <div className="answer-head">
              <span className="avatar" />
              <span className="who">Wayfare assistant</span>
            </div>

            <div className="answer-text">
              {answerUtil.toLines(entry.answer).map((line, lineIndex) => (
                <p
                  key={lineIndex}
                  className={line.isItem ? "answer-line item" : "answer-line"}
                >
                  {line.parts.map((part, partIndex) =>
                    part.kind === AnswerPartKind.Country ? (
                      <span key={partIndex} className="country">
                        {part.text}
                        <Flag place={part.text} />
                      </span>
                    ) : (
                      <span key={partIndex} className={part.kind}>
                        {part.text}
                      </span>
                    ),
                  )}
                </p>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

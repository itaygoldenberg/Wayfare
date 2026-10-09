import z from "zod";
import { ClientError } from "./client-error";
import { StatusCode } from "./enums";

// Validation rules for a question to the MCP assistant, each with a message the user can understand.
const QuestionSchema = z.object({
  question: z
    .string("Question is required.")
    .trim()
    .min(2, "Question must have at least 2 characters.")
    .max(300, "Question can have up to 300 characters."),
});

// The model's shape, derived from the schema.
type IQuestionModel = z.infer<typeof QuestionSchema>;

// A free-text question about Wayfare's vacations.
export class QuestionModel implements IQuestionModel {
  public question: string;

  // Copies the fields from the request body.
  public constructor(request: QuestionModel) {
    this.question = request.question;
  }

  // Throws a 422 with the first validation problem found.
  public validate(): void {
    const result = QuestionSchema.safeParse(this);
    if (!result.success) {
      const message = result.error.issues[0].message;
      throw new ClientError(StatusCode.UnprocessableContent, message);
    }
  }
}

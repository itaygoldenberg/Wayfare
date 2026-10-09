import z from "zod";
import { ClientError } from "./client-error";
import { StatusCode } from "./enums";

// Validation rules for an AI recommendation request, each with a message the user can understand.
const RecommendationSchema = z.object({
  destination: z
    .string("Destination is required.")
    .trim()
    .min(2, "Destination must have at least 2 characters.")
    .max(50, "Destination can have up to 50 characters."),
});

// The model's shape, derived from the schema.
type IRecommendationModel = z.infer<typeof RecommendationSchema>;

// The destination the user wants a recommendation for.
export class RecommendationModel implements IRecommendationModel {
  public destination: string;

  // Copies the fields from the request body.
  public constructor(request: RecommendationModel) {
    this.destination = request.destination;
  }

  // Throws a 422 with the first validation problem found.
  public validate(): void {
    const result = RecommendationSchema.safeParse(this);
    if (!result.success) {
      const message = result.error.issues[0].message;
      throw new ClientError(StatusCode.UnprocessableContent, message);
    }
  }
}

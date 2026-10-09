import { AnswerPartKind } from "./enums";

// A piece of an answer line: plain text, or a price, date, number or country to highlight.
export class AnswerPartModel {
  public kind: AnswerPartKind;
  public text: string;
}

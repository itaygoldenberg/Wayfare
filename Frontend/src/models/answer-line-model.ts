import { AnswerPartModel } from "./answer-part-model";

// One line of an assistant's answer: a sentence, or an item of a list.
export class AnswerLineModel {
  public isItem: boolean;
  public parts: AnswerPartModel[];
}

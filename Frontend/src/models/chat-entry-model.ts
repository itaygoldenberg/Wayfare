import { AnswerModel } from "./answer-model";

// One question and its answer in the Ask Wayfare history.
export class ChatEntryModel extends AnswerModel {
  public id: number;
  public question: string;
}

import { AnswerLineModel } from "../models/answer-line-model";
import { AnswerPartModel } from "../models/answer-part-model";
import { AnswerPartKind } from "../models/enums";
import { dateUtil } from "./date-util";

// Turns the assistant's plain-text answer into lines and pieces, so the page can style the data in it.
class AnswerUtil {
  // The countries that have a flag picture in flag.css (the same names; a new country goes into both).
  private countries = [
    "Argentina",
    "Australia",
    "Austria",
    "Belgium",
    "Brazil",
    "Canada",
    "Chile",
    "China",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Egypt",
    "Finland",
    "France",
    "Georgia",
    "Germany",
    "Greece",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Ireland",
    "Israel",
    "Italy",
    "Japan",
    "Jordan",
    "Kenya",
    "Maldives",
    "Malta",
    "Mexico",
    "Montenegro",
    "Morocco",
    "Netherlands",
    "New Zealand",
    "Norway",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Singapore",
    "South Africa",
    "South Korea",
    "Spain",
    "Sri Lanka",
    "Sweden",
    "Switzerland",
    "Tanzania",
    "Thailand",
    "Turkey",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "USA",
    "Vietnam",
  ];

  // Splits the answer into lines; a line starting with "- " is a list item.
  public toLines(answer: string): AnswerLineModel[] {
    return answer
      .split("\n")
      .map((text) => text.trim())
      .filter((text) => text)
      .map((text) => {
        const line = new AnswerLineModel();
        line.isItem = text.startsWith("- ");
        line.parts = this.toParts(line.isItem ? text.slice(2) : text);
        return line;
      });
  }

  // Splits a line into words and marks the prices, dates, numbers and countries among them.
  private toParts(text: string): AnswerPartModel[] {
    const parts: AnswerPartModel[] = [];
    const words = text.split(" ");
    for (let i = 0; i < words.length; i++) {
      // A country can be one to three words, like "Japan" or "Czech Republic"; it gets its flag on the page
      const countryLength = this.getCountryLength(words, i);
      if (countryLength > 0) {
        const lastWord = words[i + countryLength - 1];
        const lastName = this.removeEndPunctuation(lastWord);
        const part = new AnswerPartModel();
        part.kind = AnswerPartKind.Country;
        part.text = words
          .slice(i, i + countryLength - 1)
          .concat(lastName)
          .join(" ");
        parts.push(part);
        const space = i + countryLength < words.length ? " " : "";
        this.addText(parts, lastWord.slice(lastName.length) + space);
        i += countryLength - 1;
        continue;
      }

      const word = words[i];
      const space = i < words.length - 1 ? " " : "";
      const data = this.removeEndPunctuation(word);
      const kind = this.getKind(data);

      if (kind === AnswerPartKind.Text) {
        this.addText(parts, word + space);
        continue;
      }

      // Dates and prices are shown the way the rest of the site shows them
      const part = new AnswerPartModel();
      part.kind = kind;
      part.text = data;
      if (kind === AnswerPartKind.Date) part.text = dateUtil.format(data);
      if (kind === AnswerPartKind.Price) part.text = this.formatPrice(data);
      parts.push(part);
      this.addText(parts, word.slice(data.length) + space);
    }
    return parts;
  }

  // How many words, starting at this one, make a country name: 3, 2 or 1, or 0 when they are not a country.
  private getCountryLength(words: string[], start: number): number {
    for (let length = 3; length >= 1; length--) {
      if (start + length > words.length) continue;
      const name = words.slice(start, start + length).join(" ");
      if (this.countries.includes(this.removeEndPunctuation(name)))
        return length;
    }
    return 0;
  }

  // Adds plain text, joined to the text before it, so a sentence is not cut into single words.
  private addText(parts: AnswerPartModel[], text: string): void {
    if (!text) return;
    const last = parts[parts.length - 1];
    if (last && last.kind === AnswerPartKind.Text) {
      last.text += text;
      return;
    }
    const part = new AnswerPartModel();
    part.kind = AnswerPartKind.Text;
    part.text = text;
    parts.push(part);
  }

  // Writes a price with thousands commas, like the vacation cards: "$3780" becomes "$3,780".
  private formatPrice(price: string): string {
    const amount = Number(price.slice(1).split(",").join(""));
    if (isNaN(amount)) return price;
    return "$" + amount.toLocaleString();
  }

  // Removes punctuation from the end of a word, like the period in "2026-10-20."
  private removeEndPunctuation(word: string): string {
    let end = word.length;
    while (end > 0 && ".,!?:;)".includes(word[end - 1])) {
      end--;
    }
    return word.slice(0, end);
  }

  // Decides what a word is: a price like $2,810, a date like 2026-10-20, a number, or plain text.
  private getKind(word: string): AnswerPartKind {
    if (word.length > 1 && word.startsWith("$")) return AnswerPartKind.Price;
    if (this.isDate(word)) return AnswerPartKind.Date;
    if (this.isNumber(word)) return AnswerPartKind.Number;
    return AnswerPartKind.Text;
  }

  // Checks for the server's date format: 10 characters with dashes in places 4 and 7, like 2026-10-20.
  private isDate(word: string): boolean {
    return (
      word.length === 10 &&
      word[4] === "-" &&
      word[7] === "-" &&
      this.isNumber(word.split("-").join(""))
    );
  }

  // Checks for a number like 12, 3.5 or 1,890: it starts with a digit and the whole word is a number.
  private isNumber(word: string): boolean {
    if (!word || !"0123456789".includes(word[0])) return false;
    return !isNaN(Number(word.split(",").join("")));
  }
}

export const answerUtil = new AnswerUtil();

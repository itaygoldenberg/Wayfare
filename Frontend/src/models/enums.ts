// User roles, matching the values stored in the database.
export enum Role {
  User = "User",
  Admin = "Admin",
}

// The kinds of text inside an assistant's answer; each one is styled differently.
export enum AnswerPartKind {
  Text = "text",
  Price = "price",
  Date = "date",
  Number = "number",
  Country = "country",
}

// The four views of the vacations page.
export enum VacationFilter {
  All = "All",
  Liked = "Liked",
  Active = "Active",
  Future = "Future",
}

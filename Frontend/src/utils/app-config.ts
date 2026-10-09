// Every server address and fixed setting of the app, in one place.
class AppConfig {
  public readonly serverUrl =
    import.meta.env.VITE_SERVER_URL || "http://localhost:4000";
  public readonly registerUrl = this.serverUrl + "/api/register";
  public readonly loginUrl = this.serverUrl + "/api/login";
  public readonly vacationsUrl = this.serverUrl + "/api/vacations";
  public readonly vacationImagesUrl = this.serverUrl + "/api/vacations/images/";
  public readonly recommendationUrl = this.serverUrl + "/api/ai/recommendation";
  public readonly askUrl = this.serverUrl + "/api/ai/ask";

  public readonly vacationsPerPage = 9;
  public readonly maxPrice = 10000;
  public readonly csvFileName = "wayfare-likes.csv";

  public readonly githubUrl = "https://github.com/itaygoldenberg";
  public readonly linkedinUrl = "https://www.linkedin.com/in/itay-goldenberg/";
}

export const appConfig = new AppConfig();

import axios from "axios";
import { userService } from "../services/user-service";

// Hooks into every request and response that axios sends.
class Interceptor {
  // Adds the token to each request, and logs out when the server rejects an expired one.
  public create(): void {
    axios.interceptors.request.use((request) => {
      const token = localStorage.getItem("token");
      if (token) request.headers.Authorization = "Bearer " + token;
      return request;
    });

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && localStorage.getItem("token"))
          userService.logout();
        return Promise.reject(error);
      },
    );
  }
}

export const interceptor = new Interceptor();

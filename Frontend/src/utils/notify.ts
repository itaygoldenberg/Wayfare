import iziToast, { IziToastSettings } from "izitoast";
import "izitoast/dist/css/iziToast.css";

// Short pop-up messages for success and errors; their glass look lives in index.css (.wayfare-toast).
class Notify {
  private readonly settings: IziToastSettings = {
    position: "topRight",
    timeout: 3000,
    theme: "dark",
    class: "wayfare-toast",
    transitionIn: "fadeInLeft",
    transitionOut: "fadeOutRight",
  };

  // Shows a success message.
  public success(message: string): void {
    iziToast.success({ ...this.settings, message });
  }

  // Shows our own text as it is, or the server's message, or a clear sentence
  // when the server did not answer (instead of axios' own "Network Error").
  public error(err: any): void {
    let message = "Something went wrong, please try again.";
    if (typeof err === "string") message = err;
    else if (err?.response?.data?.message) message = err.response.data.message;
    else if (err?.request && !err.response)
      message = "The server is not responding. Please try again in a moment.";
    else if (err?.message && !err.request) message = err.message;
    iziToast.error({ ...this.settings, message });
  }
}

export const notify = new Notify();

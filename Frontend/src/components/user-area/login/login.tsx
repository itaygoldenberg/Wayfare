import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { CredentialsModel } from "../../../models/credentials-model";
import { userService } from "../../../services/user-service";
import { notify } from "../../../utils/notify";

// Login form; wrong details come back from the server as an error message.
export function Login() {
  const { register, handleSubmit } = useForm<CredentialsModel>();
  const navigate = useNavigate();

  // Logs in and goes to the vacations page.
  async function send(credentials: CredentialsModel): Promise<void> {
    try {
      await userService.login(credentials);
      notify.success("Welcome back!");
      navigate("/vacations");
    } catch (err: any) {
      notify.error(err);
    }
  }

  return (
    <div className="form-card">
      <h2 className="page-title">Welcome back</h2>
      <p className="page-subtitle">Log in to see this season's vacations.</p>

      <form onSubmit={handleSubmit(send)}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register("email")}
          required
          maxLength={100}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...register("password")}
          required
          minLength={4}
          maxLength={100}
        />

        <button className="icon-login">Login</button>
      </form>

      <p className="form-footer">
        New here? <NavLink to="/register">Create an account</NavLink>
      </p>
    </div>
  );
}

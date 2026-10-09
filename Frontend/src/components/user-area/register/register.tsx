import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { UserModel } from "../../../models/user-model";
import { userService } from "../../../services/user-service";
import { notify } from "../../../utils/notify";

// Sign-up form; a taken email comes back from the server as an error message.
export function Register() {
  const { register, handleSubmit } = useForm<UserModel>();
  const navigate = useNavigate();

  // Registers, logs in, and goes to the vacations page.
  async function send(user: UserModel): Promise<void> {
    try {
      await userService.register(user);
      notify.success("Welcome to Wayfare, " + user.firstName + "!");
      navigate("/vacations");
    } catch (err: any) {
      notify.error(err);
    }
  }

  return (
    <div className="form-card">
      <h2 className="page-title">Create an account</h2>
      <p className="page-subtitle">
        Save the trips you love and see what others are dreaming of.
      </p>

      <form onSubmit={handleSubmit(send)}>
        <label htmlFor="firstName">First name</label>
        <input
          id="firstName"
          type="text"
          {...register("firstName")}
          required
          minLength={2}
          maxLength={50}
        />

        <label htmlFor="lastName">Last name</label>
        <input
          id="lastName"
          type="text"
          {...register("lastName")}
          required
          minLength={2}
          maxLength={50}
        />

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

        <button className="icon-register">Register</button>
      </form>

      <p className="form-footer">
        Already a member? <NavLink to="/login">Log in</NavLink>
      </p>
    </div>
  );
}

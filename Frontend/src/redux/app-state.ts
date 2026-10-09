import { UserModel } from "../models/user-model";
import { VacationModel } from "../models/vacation-model";

// Everything kept in the global state.
export class AppState {
  public user: UserModel;
  public vacations: VacationModel[];
}

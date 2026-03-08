import layout from "./layout";
import auth from "./api/auth/authSlice";
import loading from "./api/loadingSlice";

const rootReducer = {
  layout,
  auth,
  loading,
};
export default rootReducer;

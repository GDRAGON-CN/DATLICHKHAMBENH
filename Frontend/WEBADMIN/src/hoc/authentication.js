import locationHelperBuilder from "redux-auth-wrapper/history4/locationHelper";
import { connectedRouterRedirect } from "redux-auth-wrapper/history4/redirect";

const locationHelper = locationHelperBuilder({});

export const userIsAuthenticated = connectedRouterRedirect({
  authenticatedSelector: (state) => state.user.isLoggedIn,
  wrapperDisplayName: "UserIsAuthenticated",
  redirectPath: "/login",
});

export const userIsNotAuthenticated = connectedRouterRedirect({
  // Want to redirect the user when they are authenticated
  authenticatedSelector: (state) => !state.user.isLoggedIn,
  wrapperDisplayName: "UserIsNotAuthenticated",
  redirectPath: (state, ownProps) => {
    let userInfo = state.user.userInfo;
    if (userInfo && userInfo.roleId) {
      let roleId = userInfo.roleId;
      if (roleId === "R1") {
        return "/system";
      } else if (roleId === "R2") {
        return "/doctor";
      }
    }
    return locationHelper.getRedirectQueryParam(ownProps) || "/";
  },
  allowRedirectBack: false,
});

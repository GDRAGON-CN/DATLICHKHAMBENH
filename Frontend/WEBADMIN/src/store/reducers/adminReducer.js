import actionTypes from "../actions/actionTypes";

const initialState = {
  isLoadingState: false,
  genders: [],
  roles: [],
  positions: [],
  users: [],
  topDoctors: [],
  allDoctor: [],
  allScheduleTime: [],
  allRequiredDoctorInfor: [],
};

const adminReducer = (state = initialState, action) => {
  let copyState = { ...state };
  switch (action.type) {
    case actionTypes.FETCH_GENDER_START:
      copyState.isLoadingState = true;
      return {
        ...copyState,
      };
    case actionTypes.FETCH_GENDER_SUCCESS:
      copyState.genders = action.data;
      copyState.isLoadingState = false;
      return {
        ...copyState,
      };
    case actionTypes.FETCH_GENDER_FAILED:
      copyState.isLoadingState = false;
      copyState.genders = [];
      return {
        ...copyState,
      };
    case actionTypes.FETCH_POSITION_SUCCESS:
      copyState.positions = action.data;
      copyState.isLoadingState = false;
      return {
        ...copyState,
      };
    case actionTypes.FETCH_POSITION_FAILED:
      copyState.isLoadingState = false;
      copyState.positions = [];
      return {
        ...copyState,
      };
    case actionTypes.FETCH_ROLE_SUCCESS:
      copyState.roles = action.data;
      copyState.isLoadingState = false;
      return {
        ...copyState,
      };
    case actionTypes.FETCH_ROLE_FAILED:
      copyState.isLoadingState = false;
      copyState.roles = [];
      return {
        ...copyState,
      };

    case actionTypes.FETCH_ALL_USERS_SUCCESS:
      return {
        ...state,
        users: action.users,
      };

    case actionTypes.FETCH_ALL_USERS_FAILED:
      return {
        ...state,
        users: [],
      };

    case actionTypes.FETCH_TOP_DOCTORS_SUCCESS:
      state.topDoctors = action.dataDoctors;
      return {
        ...state,
      };

    case actionTypes.FETCH_TOP_DOCTORS_FAILED:
      state.topDoctors = [];
      return {
        ...state,
      };

    case actionTypes.FETCH_ALL_DOCTORS_SUCCESS:
      state.allDoctors = action.dataDr;
      return {
        ...state,
      };

    case actionTypes.FETCH_ALL_DOCTORS_FAILED:
      state.allDoctors = [];
      return {
        ...state,
      };
    case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED:
      return {
        ...state,
      };
    case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS:
      state.allScheduleTime = action.dataTime;
      return {
        ...state,
      };
    case actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_SUCCESS:
      state.allRequiredDoctorInfor = action.data;
      console.log("check state", action);
      return {
        ...state,
      };
    case actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAILED:
      state.allRequiredDoctorInfor = [];
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default adminReducer;

import axios from "../axios";
const handleLoginApi = (userEmail, userPassword) => {
  return axios.post("/api/login", {
    email: userEmail,
    password: userPassword,
  });
};
const getAllUsers = (inputId) => {
  //template string
  return axios.get(`/api/get-all-users?id=${inputId}`);
};
const createNewUserService = (data) => {
  console.log("check data from services: ", data);
  return axios.post("/api/create-new-user", data);
};
const deleteUserService = (userId) => {
  // return axios.delete("/api/delete-user");
  return axios.delete("/api/delete-user", {
    data: {
      id: userId,
    },
  });
};
const editUserService = (inputData) => {
  return axios.put(`/api/edit-user`, inputData);
};
const getAllCodeService = (inputType) => {
  return axios.get(`/api/allcode?type=${inputType}`);
};

const getTopDoctorHomeService = (limit) => {
  return axios.get(`/api/top-doctor-home?limit=${limit}`);
};
const getSearchSuggestionsService = (keyword) => {
  return axios.get(`/api/get-search-suggestions?keyword=${keyword}`);
};
const getAllDoctors = () => {
  return axios.get("/api/get-all-doctors");
};
const saveDetailDoctorService = (data) => {
  return axios.post("/api/save-infor-doctors", data);
};
const getDetailInforDoctor = (inputId) => {
  return axios.get(`/api/get-detail-doctor-by-id?id=${inputId}`);
};
const saveBulkScheduleDoctor = (data) => {
  return axios.post("/api/bulk-create-schedule", data);
};
const getScheduleDoctorByDate = (doctorId, date) => {
  return axios.get(
    `/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`,
  );
};
const getExtraInforDoctorById = (doctorId) => {
  return axios.get(`/api/get-extra-infor-doctor-by-id?doctorId=${doctorId}`);
};
const getProfileInforDoctorById = (doctorId) => {
  return axios.get(`/api/get-profile-infor-doctor-by-id?doctorId=${doctorId}`);
};
const postPatientBookAppointment = (data) => {
  return axios.post("/api/patient-book-appointment", data);
};
const postVerifyBookAppointment = (data) => {
  return axios.post("/api/verify-book-appointment", data);
};
const createNewSpecialty = (data) => {
  return axios.post("/api/create-new-specialty", data);
};
const getAllSpecialty = () => {
  return axios.get("/api/get-specialty");
};
const getTopSpecialtyHome = (limit) => {
  return axios.get(`/api/get-top-specialty-home?limit=${limit}`);
};
const getDetailSpecialtyById = (data) => {
  return axios.get(
    `/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`,
  );
};
const updateSpecialtyData = (data) => {
  return axios.put("/api/edit-specialty", data);
};
const deleteSpecialtyService = (specialtyId) => {
  return axios.delete("/api/delete-specialty", {
    data: { id: specialtyId },
  });
};
const createClinic = (data) => {
  return axios.post("/api/create-new-clinic", data);
};
const getAllClinic = () => {
  return axios.get("/api/get-clinic");
};
const getTopClinicHome = (limit) => {
  return axios.get(`/api/get-top-clinic-home?limit=${limit}`);
};
const getDetailClinicById = (data) => {
  return axios.get(`/api/get-detail-clinic-by-id?id=${data.id}`);
};
const getAllPatientForDoctor = (data) => {
  return axios.get(
    `/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}`,
  );
};
const updateClinicData = (data) => {
  return axios.put("/api/edit-clinic", data);
};

const deleteClinicService = (clinicId) => {
  return axios.delete("/api/delete-clinic", {
    data: { id: clinicId }, // Truyền ID vào body cho đúng chuẩn delete của bạn
  });
};
const postSendRemedy = (data) => {
  return axios.post("/api/send-remedy", data);
};

export {
  handleLoginApi,
  getAllUsers,
  createNewUserService,
  deleteUserService,
  editUserService,
  // getDetailInforDoctor,
  getAllCodeService,
  getSearchSuggestionsService,
  getTopDoctorHomeService,
  getAllDoctors,
  saveDetailDoctorService,
  getDetailInforDoctor,
  saveBulkScheduleDoctor,
  getScheduleDoctorByDate,
  getExtraInforDoctorById,
  getProfileInforDoctorById,
  postPatientBookAppointment,
  postVerifyBookAppointment,
  createNewSpecialty,
  getTopSpecialtyHome,
  getAllSpecialty,
  getDetailSpecialtyById,
  createClinic,
  getAllClinic,
  getTopClinicHome,
  getDetailClinicById,
  getAllPatientForDoctor,
  updateClinicData,
  deleteClinicService,
  updateSpecialtyData,
  deleteSpecialtyService,
  postSendRemedy,
};

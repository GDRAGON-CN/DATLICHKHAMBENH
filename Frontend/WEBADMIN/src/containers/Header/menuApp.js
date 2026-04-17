export const adminMenu = [
  {
    // Cụm Quản lý hệ thống (Gộp tất cả vào đây)
    name: "TRANG QUẢN LÝ CỦA ADMIN",
    menus: [
      {
        name: "Quản lí người dùng",
        link: "/system/user-redux",
      },
      {
        name: "Quản lý thông tin bác sĩ",
        link: "/system/manage-doctor",
      },
      {
        name: "Quản lý lịch khám bệnh của bác sĩ",
        link: "/doctor/manage-schedule",
      },
      {
        name: "Lịch hẹn của bệnh nhân",
        link: "/system/manage-done-booking",
      },
      {
        name: "Quản lý phòng khám",
        link: "/system/manage-clinic",
      },

      {
        name: "Quản lý chuyên khoa",
        link: "/system/manage-specialty",
      },
    ],
  },
];

export const doctorMenu = [
  {
    name: "TRANG QUẢN LÝ CỦA BÁC SĨ",
    menus: [
      {
        name: "Quản lý lịch khám chữa bệnh",
        link: "/doctor/manage-schedule",
      },
      {
        name: "Quản lý danh sách bệnh nhân",
        link: "/doctor/manage-patient",
      },
    ],
  },
];

export function createInitialRegistrationFormData() {
  return {
    name: "",
    universityName: "",
    branch: "",
    teamName: "",
    mobileNo: "",
    email: "",
    aadharNo: "",
    aadharPhoto: null,
  };
}

export const registrationToastOptions = {
  style: {
    zIndex: 99999,
    padding: "16px 20px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },
  success: {
    style: {
      background: "linear-gradient(135deg, #ff8e2f 0%, #ffb24a 100%)",
      color: "#1c0f53",
      zIndex: 99999,
    },
  },
  error: {
    style: {
      background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      color: "white",
      zIndex: 99999,
    },
  },
};

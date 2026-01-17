export const loginAPI = async (email, password) => {
  // Giả lập delay 1 xíu cho giống thật
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === "buyer@gmail.com" && password === "123456") {
        resolve({
          id: 1,
          name: "Test User",
          email: "buyer@gmail.com",
          role: "BUYER",
        });
      } else {
        reject(
          new Error("Sai email hoặc mật khẩu (Thử: buyer@gmail.com / 123456)"),
        );
      }
    }, 800);
  });
};

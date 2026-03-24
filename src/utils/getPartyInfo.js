/**
 * Shared utility to extract buyer/seller info from task data.
 * Handles both nested objects and flat fields with fallback mapping.
 */

const getFirstAvailableValue = (values) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return "";
};

export const getPartyInfo = (taskData, role) => {
  const party = taskData?.[role];
  const isBuyer = role === "buyer";

  const name = getFirstAvailableValue([
    typeof party === "string" ? party : "",
    party?.fullName,
    party?.name,
    party?.username,
    party?.buyerName,
    party?.sellerName,
    taskData?.[`${role}Name`],
    taskData?.[`${role}FullName`],
    isBuyer ? taskData?.buyerName : taskData?.sellerName,
    isBuyer ? taskData?.buyerFullName : taskData?.sellerFullName,
  ]);

  const phone = getFirstAvailableValue([
    party?.phone,
    party?.phoneNumber,
    party?.phoneNum,
    party?.mobile,
    taskData?.[`${role}Phone`],
    taskData?.[`${role}PhoneNumber`],
    taskData?.[`${role}PhoneNum`],
    isBuyer ? taskData?.buyerPhone : taskData?.sellerPhone,
    isBuyer ? taskData?.buyerPhoneNumber : taskData?.sellerPhoneNumber,
    isBuyer ? taskData?.buyerPhoneNum : taskData?.sellerPhoneNum,
  ]);

  return { name, phone };
};

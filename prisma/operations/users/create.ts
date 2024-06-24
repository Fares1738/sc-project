import { isAddress } from "viem";
import { prisma } from "../../../src/utils/prisma";
import { User } from "../../../src/utils/types";

export default async function createUser(obj: User) {
  const { userType, userAddress, matricNumber, cgpa, fullName } = obj;
  if (!["STUDENT", "CM"].includes(userType)) throw Error("invalid user type!");
  if (!isAddress(userAddress)) throw Error("Invalid Address!");
  if (cgpa < 0 || cgpa > 400) throw Error("CGPA out of range!");

  return await prisma.user.create({
    data: {
      cgpa,
      fullName,
      matricNumber,
      userAddress,
      userType,
    },
  });
}
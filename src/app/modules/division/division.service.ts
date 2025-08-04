import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";

const createDivision = async (payload: IDivision) => {
  const isDivisionExists = await Division.findOne({ name: payload.name });
  if (isDivisionExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "Division already exists");
  }
  const division = await Division.create(payload);
  return division;
};

const getAllDivisions = async () => {
  const allDivisions = await Division.find();
  const totalDivisionsCount = await Division.countDocuments();
  return {
    data: allDivisions,
    meta: { total: totalDivisionsCount },
  };
};

const getSingleDivision = async (slug: string) => {
  const division = await Division.findOne({ slug });
  return {
    data: division,
  };
};

const updateDivision = async (id: string, payload: Partial<IDivision>) => {
  const isDivisionExist = await Division.findById(id);
  if (!isDivisionExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Division does not exist");
  }
  if (payload.name) {
    const isDuplicateDivision = await Division.findOne({
      name: payload.name,
      _id: { $ne: id },
    });

    if (isDuplicateDivision) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Division with this name already exists"
      );
    }
  }
  const updatedDivision = await Division.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return {
    data: updatedDivision,
  };
};

const deleteDivision = async(id: string) =>{
    await Division.findByIdAndDelete(id);
    return null;
}

export const DivisionServices = {
  createDivision,
  getAllDivisions,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};

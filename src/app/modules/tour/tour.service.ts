import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { ITourType } from "./tour.interface";
import { TourType } from "./tour.model";

/**-----------------------Tour Types---------------------- */
const createTourType = async (payload: ITourType) => {
  const isTourTypeExists = await TourType.findOne({ name: payload.name });
  if (isTourTypeExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "Tour type already exists");
  }
  const newTourType = await TourType.create(payload);
  return newTourType;
};

const getAllTourTypes = async () => {
  const allTourTypes = await TourType.find();
  return allTourTypes;
};

const updateTourType = async (id: string, payload: Partial<ITourType>) => {
  const isTourTypeExists = await TourType.findById(id);
  if (!isTourTypeExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour Type not found");
  }
  const updatedTourType = await TourType.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return updatedTourType;
};

const deleteTourType = async (id: string) => {
  const isTourTypeExists = await TourType.findById(id);
  if (!isTourTypeExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour Type not found");
  }
  return await TourType.findByIdAndDelete(id);
};


/**--------------------Tour----------------------- */
export const TourTypeService = {
  createTourType,
  getAllTourTypes,
  updateTourType,
  deleteTourType,
};

import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

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
const createTour = async (payload: ITour) => {
  const isExist = await Tour.findOne({ title: payload.title });
  if (isExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Tour already exists");
  }
  const newTour = await Tour.create(payload);
  return newTour;
};

const getAllTours = async () => {
  const allTours = await Tour.find();
  const totalToursCount = await Tour.countDocuments();
  return {
    data: allTours,
    meta: { total: totalToursCount },
  };
};

const updateTour = async( id: string, payload : Partial<ITour>) => {
  const isTourExists = await Tour.findById(id);
  if (!isTourExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour not found");
  }
  const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true });
  return updatedTour;
};

const deleteTour = async(id: string) => {
  const isTourExists = await Tour.findById(id);
  if (!isTourExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour not found");
  }
  return await Tour.findByIdAndDelete(id);
}
export const TourService = {
  createTourType,
  getAllTourTypes,
  updateTourType,
  deleteTourType,
  createTour,
  getAllTours,
  updateTour,
  deleteTour,
};

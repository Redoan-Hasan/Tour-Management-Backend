import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import { tourSearchableFields } from "./tour.constant";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { deleteFromCloudinary } from "../../config/cloudinary.config";

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
  // throw new AppError(httpStatus.BAD_REQUEST, "Fake Error")
  const newTour = await Tour.create(payload);
  return newTour;
};

// const getAllTours = async (query: Record<string, string>) => {
//   const filter = query;
//   console.log(filter);
//   const searchTerm = query?.searchTerm || "";
//   const sort = query?.sort || "-createdAt";
//   const field = query?.field?.split(",").join("") || "";
//   const page = Number(query?.page) || 1;
//   const limit = Number(query?.limit) || 10;
//   const skip = (page - 1) * limit;
//   // delete filter["searchTerm"];
//   // delete filter["sort"];
//   // delete filter.searchTerm;

// for(const field of excludedFields) {
//   // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//   delete filter[field];
// }

//   const searchQuery = {
//     $or: tourSearchableFields.map((field) => ({
//       [field]: { $regex: searchTerm, $options: "i" },
//     })),
//   };
//   // const allTours = await Tour.find(searchQuery).find(filter).sort(sort).select(field).skip(skip).limit(limit);
//   const filterQuery = Tour.find(filter);
//   const tours = filterQuery.find(searchQuery);
//   const allTours = await tours.sort(sort).select(field).skip(skip).limit(limit);
//   const totalToursCount = await Tour.countDocuments();
//   return {
//     data: allTours,
//     meta: {
//       page,
//       limit,
//       total: totalToursCount,
//       totalPage : Math.ceil(totalToursCount/limit)
//     },
//   };
// };

const getAllTours = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Tour.find(), query);
  const tours = await queryBuilder
    .search(tourSearchableFields)
    .filter()
    .sort()
    .paginate();
  // const meta = await queryBuilder.getMeta();
  const [data, meta] = await Promise.all([
    tours.build(),
    queryBuilder.getMeta(),
  ]);
  return {
    data,
    meta,
  };
};

const updateTour = async (id: string, payload: Partial<ITour>) => {
  const isTourExists = await Tour.findById(id);
  if (!isTourExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour not found");
  }

  if (
    payload.images &&
    payload.images?.length > 0 &&
    isTourExists.images &&
    isTourExists.images.length > 0
  ) {
    payload.images = [...payload.images, ...isTourExists.images];
  }

  if (
    payload.deleteImages &&
    payload.deleteImages.length > 0 &&
    isTourExists.images &&
    isTourExists.images.length > 0
  ) {
    const restDBImages = isTourExists.images.filter(
      (imageUrl) => !payload.deleteImages?.includes(imageUrl)
    );
    const updatedPayloadImages = (payload.images || [])
      .filter((imageUrl) => !payload.deleteImages?.includes(imageUrl))
      .filter((imageUrl) => !restDBImages.includes(imageUrl));
    payload.images = [...restDBImages, ...updatedPayloadImages];
  }

  const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true });

  if (
    payload.deleteImages &&
    payload.deleteImages.length > 0 &&
    isTourExists.images &&
    isTourExists.images.length > 0
  ) {
    await Promise.all(
      payload.deleteImages?.map((url) => deleteFromCloudinary(url))
    );
  }
  return updatedTour;
};

const deleteTour = async (id: string) => {
  const isTourExists = await Tour.findById(id);
  if (!isTourExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour not found");
  }
  return await Tour.findByIdAndDelete(id);
};
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

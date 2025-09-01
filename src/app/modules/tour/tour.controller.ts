import httpStatus from "http-status-codes";
import { Request, Response } from "express";
import { catchHandler } from "../../utils/catchHandler";
import { TourService } from "./tour.service";
import { sendResponse } from "../../utils/sendResponse";

/**-------------------Tour Types----------------------**/
const createTourType = catchHandler(async (req: Request, res: Response) => {
  const tourTypeInfo = await TourService.createTourType(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Tour type created successfully",
    data: tourTypeInfo,
  });
});

const getAllTourTypes = catchHandler(async (req: Request, res: Response) => {
  const tourTypes = await TourService.getAllTourTypes();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour types retrieved successfully",
    data: tourTypes,
  });
});

const updateTourType = catchHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const updatedTourType = await TourService.updateTourType(id, payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour type updated successfully",
    data: updatedTourType,
  });
});

const deleteTourType = catchHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const deletedTourType = await TourService.deleteTourType(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour type deleted successfully",
    data: deletedTourType,
  });
});

/**-----------------------Tour----------------------- */

const createTour = catchHandler(async (req: Request, res: Response) => {
  const tourInfo = await TourService.createTour(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Tour created successfully",
    data: tourInfo,
  });
});

const getAllTours = catchHandler(async (req: Request, res: Response) => {
  const query = req.query;
  const tours = await TourService.getAllTours(query as Record<string, string>);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All tours retrieved successfully",
    data: tours.data,
    meta : tours.meta
  });
});

const updateTour = catchHandler(async (req: Request, res: Response) => {
  const tourId = req.params.id;
  const payload = req.body;
  const updatedTour = await TourService.updateTour(tourId, payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour updated successfully",
    data: updatedTour,
  });
});

const deleteTour = catchHandler(async (req: Request, res: Response) => {
  const tourId = req.params.id;
  await TourService.deleteTour(tourId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour deleted successfully",
    data: null,
  });
});
export const TourController = {
  createTourType,
  getAllTourTypes,
  updateTourType,
  deleteTourType,
  createTour,
  getAllTours,
  updateTour,
  deleteTour,
};

import httpStatus from "http-status-codes";
import { Request, Response } from "express";
import { catchHandler } from "../../utils/catchHandler";
import { TourTypeService } from "./tour.service";
import { sendResponse } from "../../utils/sendResponse";

/**-------------------Tour Types----------------------**/
const createTourType = catchHandler(async (req: Request, res: Response) => {
  const tourTypeInfo = await TourTypeService.createTourType(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Tour type created successfully",
    data: tourTypeInfo,
  });
});

const getAllTourTypes = catchHandler(async (req: Request, res: Response) => {
  const tourTypes = await TourTypeService.getAllTourTypes();
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
  const updatedTourType = await TourTypeService.updateTourType(id, payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour type updated successfully",
    data: updatedTourType,
  });
});

const deleteTourType = catchHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const deletedTourType = await TourTypeService.deleteTourType(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour type deleted successfully",
    data: deletedTourType,
  });
});


/**-----------------------Tour----------------------- */
export const TourController = {
  createTourType,
  getAllTourTypes,
  updateTourType,
  deleteTourType,
};

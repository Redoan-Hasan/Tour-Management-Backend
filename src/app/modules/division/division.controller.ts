import httpStatus from "http-status-codes";
import { Request, Response } from "express";
import { catchHandler } from "../../utils/catchHandler";
import { DivisionServices } from "./division.service";
import { sendResponse } from "../../utils/sendResponse";
import { IDivision } from "./division.interface";

const createDivision = catchHandler(async (req: Request, res: Response) => {
  const payload: IDivision = {
    ...req.body,
    thumbnail: req.file?.path,
  };
  // console.log({ file: req.file, body: req.body });
  const divisionInfo = await DivisionServices.createDivision(payload);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Division created successfully",
    data: divisionInfo,
  });
});

const getAllDivisions = catchHandler(async (req: Request, res: Response) => {
  const allDivisions = await DivisionServices.getAllDivisions();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All divisions retrieved successfully",
    data: allDivisions.data,
    meta: allDivisions.meta,
  });
});

const getSingleDivision = catchHandler(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const division = await DivisionServices.getSingleDivision(slug);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Division retrieved successfully",
    data: division.data,
  });
});

const updateDivision = catchHandler(async (req: Request, res: Response) => {
  const divisionId = req.params.id;
  const payload : IDivision = { ...req.body, thumbnail: req.file?.path };
  const updatedDivision = await DivisionServices.updateDivision(
    divisionId,
    payload
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Division updated successfully",
    data: updatedDivision.data,
  });
});

const deleteDivision = catchHandler(async (req: Request, res: Response) => {
  const divisionId = req.params.id;
  await DivisionServices.deleteDivision(divisionId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Division deleted successfully",
    data: null,
  });
});

export const DivisionController = {
  createDivision,
  getAllDivisions,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};

import { Request, RequestHandler, Response } from "express"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import httpStatus from "http-status"
import { FlatServices } from "./flat.service"
import pick from "../../utils/pick"
import { flatFilterableFields } from "./flat.constants"

const addFlatIntoDB = catchAsync(async (req: Request, res: Response) => {
    const result = await FlatServices.addFlatIntoDB(req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Flat added successfully",
        data: result
    })
});


const getAllFlats: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, flatFilterableFields);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);


    const result = await FlatServices.getAllFlats(filters, options);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Flats fetched successfully",
        meta: result.meta,
        data: result.data
    });
});



const updateFlat = catchAsync(async (req: Request, res: Response) => {
    const { flatId } = req.params;

    const result = await FlatServices.updateFlat(flatId, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Flat updated successfully",
        data: result
    })
});







export const FlatControllers = {
    addFlatIntoDB,
    getAllFlats,
    updateFlat,
} 
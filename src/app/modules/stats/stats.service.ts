import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { Tour } from "../tour/tour.model";
import { IsActive } from "../user/user.interface";
import { User } from "../user/user.model";

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);

const getBookingStats = async () => {
  const totalBookingPromise = Booking.countDocuments();
  const totalBookingByStatusPromise = Booking.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);
  const bookingsPerTourPromise = Booking.aggregate([
    {
      $group: {
        _id: "$tour",
        bookingCount: { $sum: 1 },
      },
    },
    {
      $sort: {
        bookingCount: -1,
      },
    },
    {
      $limit: 10,
    },
    {
      $lookup: {
        from: "tours",
        localField: "_id",
        foreignField: "_id",
        as: "tour",
      },
    },
    {
      $unwind: "$tour",
    },
    {
      $project: {
        bookingCount: 1,
        "tour.title": 1,
        "tour.slug": 1,
      },
    },
  ]);
  const averageGuestCountPerBookingsPromise = Booking.aggregate([
    {
      $group: {
        _id: null,
        averageGuestCount: { $avg: "$guestCount" },
      },
    },
  ]);
  const bookingsInLast7DaysPromise = Booking.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });
  const bookingsInLast30DaysPromise = Booking.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });
  const totalBookinsByUniqueUserPromise = Booking.distinct("user").then(
    (user) => user.length
  );
  const [
    totalBooking,
    totalBookingByStatus,
    bookingsPerTour,
    averageGuestCount,
    bookingsInLast7Days,
    bookingInLast30Days,
    totalBookinsByUniqueUser,
  ] = await Promise.all([
    totalBookingPromise,
    totalBookingByStatusPromise,
    bookingsPerTourPromise,
    averageGuestCountPerBookingsPromise,
    bookingsInLast7DaysPromise,
    bookingsInLast30DaysPromise,
    totalBookinsByUniqueUserPromise,
  ]);
  return {
    totalBooking,
    totalBookingByStatus,
    bookingsPerTour,
    averageGuestCount: averageGuestCount[0].averageGuestCount,
    bookingsInLast7Days,
    bookingInLast30Days,
    totalBookinsByUniqueUser,
  };
};

const getPaymentStats = async () => {
  const totalPaymentsPromise = Payment.countDocuments();
  const totalRevenuePromise = Payment.aggregate([
    {
      $match: {
        status: PAYMENT_STATUS.PAID,
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$amount" },
      },
    },
  ]);

  const totalPaymentByStatusPromise = Payment.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const avgPaymentAmountPromise = Payment.aggregate([
    {
      $group: {
        _id: null,
        avgPaymentAmount: { $avg: "$amount" },
      },
    },
  ]);

  const paymentGatewayDataPromise = Payment.aggregate([
    {
      $group: {
        _id: {$ifNull : ["$paymentGatewayData.status", "UNKNOWN"]},
        count: { $sum: 1 },
      },
    },
  ])
  const [totalPayments, totalRevenue, totalPaymentByStatus, avgPaymentAmount ,paymentGatewayData] =
    await Promise.all([
      totalPaymentsPromise,
      totalRevenuePromise,
      totalPaymentByStatusPromise,
      avgPaymentAmountPromise,
      paymentGatewayDataPromise
    ]);
  return {
    totalPayments,
    totalRevenue: totalRevenue[0]?.totalRevenue,
    totalPaymentByStatus,
    avgPaymentAmount: avgPaymentAmount[0]?.avgPaymentAmount,
    paymentGatewayData,
  };
};
const getTourStats = async () => {
  const totalTourPromise = Tour.countDocuments();
  const totalTourByTourTypesPromise = Tour.aggregate([
    {
      $lookup: {
        from: "tourtypes",
        localField: "tourType",
        foreignField: "_id",
        as: "type",
      },
    },
    { $unwind: "$type" },
    {
      $group: {
        _id: "$type.name",
        count: { $sum: 1 },
      },
    },
  ]);
  const averageTourCostPromise = Tour.aggregate([
    {
      $group: {
        _id: null,
        averageCost: { $avg: "$costFrom" },
      },
    },
  ]);
  const totalTourByDivisonPromise = Tour.aggregate([
    {
      $lookup: {
        from: "divisions",
        localField: "division",
        foreignField: "_id",
        as: "division",
      },
    },
    { $unwind: "$division" },
    {
      $group: {
        _id: "$division.name",
        count: { $sum: 1 },
      },
    },
  ]);
  const totalHighestBookedTourPromise = Booking.aggregate([
    {
      $group: {
        _id: "$tour",
        bookingCount: { $sum: 1 },
      },
    },
    {
      $sort: {
        bookingCount: -1,
      },
    },
    {
      $limit: 5,
    },
    {
      $lookup: {
        from: "tours",
        // localField: "tour",
        // foreignField: "_id",
        let: { tourId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$tourId"] },
            },
          },
        ],
        as: "tour",
      },
    },
    {
      $unwind: "$tour",
    },
    {
      $project: {
        bookingCount: 1,
        "tour.title": 1,
        "tour.slug": 1,
      },
    },
  ]);
  const [
    totalTours,
    totalTourByTourTypes,
    averageTourCost,
    totalTourByDivison,
    totalHighestBookedTour,
  ] = await Promise.all([
    totalTourPromise,
    totalTourByTourTypesPromise,
    averageTourCostPromise,
    totalTourByDivisonPromise,
    totalHighestBookedTourPromise,
  ]);
  return {
    totalTours,
    totalTourByTourTypes,
    averageTourCost,
    totalTourByDivison,
    totalHighestBookedTour,
  };
};

const getUserStats = async () => {
  const totalUsersPromise = User.countDocuments();
  const totalActiveUsersPromise = User.countDocuments({
    isActive: IsActive.ACTIVE,
  });
  const totalBlockedUsersPromise = User.countDocuments({
    isActive: IsActive.BLOCKED,
  });
  const newUsersInLast7DaysPromise = User.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });
  const newUsersInLast30DaysPromise = User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });
  const userByRolePromise = User.aggregate([
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);
  const [
    totalUsers,
    totalActiveUsers,
    totalBlockedUsers,
    newUsersInLast7Days,
    newUsersInLast30Days,
    userByRole,
  ] = await Promise.all([
    totalUsersPromise,
    totalActiveUsersPromise,
    totalBlockedUsersPromise,
    newUsersInLast7DaysPromise,
    newUsersInLast30DaysPromise,
    userByRolePromise,
  ]);
  return {
    totalUsers,
    totalActiveUsers,
    totalBlockedUsers,
    newUsersInLast7Days,
    newUsersInLast30Days,
    userByRole,
  };
};

export const statsService = {
  getBookingStats,
  getPaymentStats,
  getTourStats,
  getUserStats,
};

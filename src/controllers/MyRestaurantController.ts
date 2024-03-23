import { Request, Response } from "express";
import Restaurant from "../models/restaurant";
import cloudinary from "cloudinary";
import Order from "../models/order";

export const getMyRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching restaurant" });
  }
};

export const getMyRestaurantOrders = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const orders = await Order.find({ restaurant: restaurant._id })
      .populate("restaurant")
      .populate("user");

    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const restaurant = await Restaurant.findOne({ user: req.userId });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    if (restaurant?.user?._id.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    order.status = status;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating order status" });
  }
};

export const createMyRestaurant = async (req: Request, res: Response) => {
  try {
    const existingRestaurant = await Restaurant.findOne({ user: req.userId });
    console.log(existingRestaurant);

    if (existingRestaurant) {
      return res
        .status(409)
        .send({ message: "User restaurant already exists" });
    }

    const image = req.file as Express.Multer.File;
    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataUri = `data:${image.mimetype};base64,${base64Image}`;

    const uploadResponse = await cloudinary.v2.uploader.upload(dataUri);

    const restaurant = Restaurant.create({
      ...req.body,
      imageUrl: uploadResponse.url,
      user: req.userId,
      lastUpdated: new Date(),
    });

    res.status(201).json({ restaurant });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateMyRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    if (req.file) {
      const image = req.file as Express.Multer.File;
      const base64Image = Buffer.from(image.buffer).toString("base64");
      const dataUri = `data:${image.mimetype};base64,${base64Image}`;

      const uploadResponse = await cloudinary.v2.uploader.upload(dataUri);

      restaurant.imageUrl = uploadResponse.url;
    }

    restaurant.set({ ...req.body, lastUpdated: new Date() });

    await restaurant.save();

    res.status(200).json(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating restaurant" });
  }
};

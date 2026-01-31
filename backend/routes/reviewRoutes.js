import express from "express";
import Review from "../models/Review.js";
import auth from "../middleware/auth.js";

const router = express.Router();


// GET Reviews of product
router.get("/products/:id/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.id })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});


// POST Review
router.post("/products/:id/reviews", auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const alreadyReviewed = await Review.findOne({
      product: req.params.id,
      user: req.user.id
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: "You already reviewed this product" });
    }

    const review = await Review.create({
      product: req.params.id,
      user: req.user.id,
      rating,
      comment
    });

    const populatedReview = await review.populate("user", "name");

    res.status(201).json({ review: populatedReview });

  } catch (error) {
    res.status(500).json({ message: "Review submit failed" });
  }
});


// UPDATE Review
router.put("/products/:id/reviews/:reviewId", auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    review.rating = req.body.rating;
    review.comment = req.body.comment;

    await review.save();

    const populatedReview = await review.populate("user", "name");

    res.json({ review: populatedReview });

  } catch (error) {
    res.status(500).json({ message: "Review update failed" });
  }
});


// DELETE Review
router.delete("/products/:id/reviews/:reviewId", auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await review.deleteOne();

    res.json({ message: "Review deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Review delete failed" });
  }
});

export default router;

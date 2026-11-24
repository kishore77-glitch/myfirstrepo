
const express = require("express");
const connectDB = require("./db");
const Movie = require("./models/Movies");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Home route
app.get("/", (req, res) => {
    res.send("Movie Management System is Running!");
});

// POST - Add a movie
app.post("/movies", async (req, res) => {
    try {
        const movie = new Movie(req.body);
        await movie.save();

        res.status(201).json({
            message: "Movie added successfully",
            movie: movie
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// GET - Display all movies
app.get("/movies", async (req, res) => {
    try {
        const movies = await Movie.find();

        res.status(200).json(movies);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// GET - Display one movie by ID
app.get("/movies/:id", async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        res.status(200).json(movie);

    } catch (error) {
        res.status(400).json({
            message: "Invalid movie ID"
        });
    }
});

// PUT - Update a movie
app.put("/movies/:id", async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!movie) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        res.status(200).json({
            message: "Movie updated successfully",
            movie: movie
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// DELETE - Delete a movie
app.delete("/movies/:id", async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);

        if (!movie) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        res.status(200).json({
            message: "Movie deleted successfully"
        });

    } catch (error) {
        res.status(400).json({
            message: "Invalid movie ID"
        });
    }
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

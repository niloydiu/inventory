const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { JWT_SECRET } = require("../middleware/auth");

// Register new user
exports.register = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      full_name,
      role = "employee",
    } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email, and password are required",
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username or email already exists",
      });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      password_hash,
      full_name,
      role,
    });

    const userData = user.toObject();
    delete userData.password_hash;

    res.status(201).json({
      success: true,
      data: userData,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to register user",
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    console.log("[Auth Controller] Login attempt:", {
      username: req.body?.username,
      hasPassword: !!req.body?.password,
    });
    const { username, password } = req.body;

    if (!username || !password) {
      console.log("[Auth Controller] Missing credentials");
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // Get user with password hash
    const user = await User.findOne({ username }).select("+password_hash");

    if (!user) {
      console.log("[Auth Controller] User not found:", username);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      console.log("[Auth Controller] Invalid password for user:", username);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    console.log("[Auth Controller] Password verified for user:", username);

    // Generate token
    const token = jwt.sign(
      {
        user_id: user._id.toString(),
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Set httpOnly cookie for security
    res.cookie("inventory_auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    // Remove password from user object
    const userData = user.toObject();
    delete userData.password_hash;

    console.log(
      "[Auth Controller] Login successful, sending response with token"
    );
    res.json({
      success: true,
      data: {
        access_token: token,
        user: userData,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.user_id).select("-password_hash");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user",
    });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    console.log("[Auth Controller] Logout request");

    // Clear the httpOnly cookie
    res.clearCookie("inventory_auth_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    // Set cache-control headers to prevent caching
    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, private",
      Pragma: "no-cache",
      Expires: "0",
    });

    console.log("[Auth Controller] Logout successful");
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to logout",
    });
  }
};

// Refresh token
exports.refreshToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.user_id).select(
      "_id username role"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const token = jwt.sign(
      {
        user_id: user._id.toString(),
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      data: { access_token: token },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to refresh token",
    });
  }
};

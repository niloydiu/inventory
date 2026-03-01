const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { User } = require("../models");

const DEFAULT_ADMIN = {
  username: "admin",
  email: "admin@inventory.app",
  fullName: "System Administrator",
  role: "admin",
};

const pwdLength = 24;

const generateRandomAdminPassword = (length = pwdLength) => {
  const rawBytes = Math.ceil((length * 3) / 4);
  return crypto
    .randomBytes(rawBytes)
    .toString("base64url")
    .slice(0, length);
};

const getEnvAdminConfig = () => {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const email = process.env.ADMIN_EMAIL || DEFAULT_ADMIN.email;
  const full_name = process.env.ADMIN_FULL_NAME || DEFAULT_ADMIN.fullName;
  const role = process.env.ADMIN_ROLE || DEFAULT_ADMIN.role;
  return { username, password, email, full_name, role };
};

async function upsertAdminUser({
  username,
  password,
  email,
  full_name,
  role = DEFAULT_ADMIN.role,
  resetSecurity = true,
}) {
  if (!username || !password) {
    throw new Error("Username and password are required to provision the admin account");
  }

  const normalizedEmail = (email || DEFAULT_ADMIN.email).toLowerCase();
  let user = await User.findOne({ username }).select(
    "+password_hash +failed_login_attempts +account_locked_until"
  );

  const ensureHash = async () => {
    if (user.password_hash) {
      const matches = await bcrypt.compare(password, user.password_hash);
      if (!matches) {
        user.password_hash = await bcrypt.hash(password, 12);
        return true;
      }
      return false;
    }

    user.password_hash = await bcrypt.hash(password, 12);
    return true;
  };

  if (user) {
    const updates = [];

    if (await ensureHash()) {
      updates.push("password");
    }

    if (user.email !== normalizedEmail) {
      user.email = normalizedEmail;
      updates.push("email");
    }

    if (user.full_name !== full_name) {
      user.full_name = full_name;
      updates.push("full_name");
    }

    if (user.role !== role) {
      user.role = role;
      updates.push("role");
    }

    if (user.is_active !== true) {
      user.is_active = true;
      updates.push("is_active");
    }

    if (resetSecurity) {
      if (user.failed_login_attempts !== 0) {
        user.failed_login_attempts = 0;
        updates.push("failed_login_attempts");
      }
      if (user.account_locked_until) {
        user.account_locked_until = null;
        updates.push("account_locked_until");
      }
    }

    if (updates.length > 0) {
      await user.save();
    }

    return { user, isNew: false, updatedFields: updates };
  }

  user = await User.create({
    username,
    email: normalizedEmail,
    password_hash: await bcrypt.hash(password, 12),
    full_name,
    role,
    is_active: true,
    failed_login_attempts: 0,
    account_locked_until: null,
  });

  return { user, isNew: true, updatedFields: ["created"] };
}

async function ensureAdminAccountFromEnv() {
  const config = getEnvAdminConfig();
  if (!config.username || !config.password) {
    console.log(
      "[Admin Account] ADMIN_USERNAME or ADMIN_PASSWORD is not fully configured; skipping admin sync."
    );
    return null;
  }

  try {
    const result = await upsertAdminUser(config);
    const action = result.isNew ? "created" : "updated";
    const changes = result.updatedFields.length
      ? result.updatedFields.join(", ")
      : "no changes";
    console.log(
      `[Admin Account] ${action} admin user ${config.username} (${changes})`
    );
    return result;
  } catch (error) {
    console.error("[Admin Account] Failed to sync admin user:", error.message);
    throw error;
  }
}

module.exports = {
  ensureAdminAccountFromEnv,
  upsertAdminUser,
  generateRandomAdminPassword,
};
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

/**
 * 🔔 Notify runners when a new task is created
 */
exports.notifyNewTask = functions.database
  .ref("/tasks/{city}/{taskId}")
  .onCreate(async (snapshot, context) => {
    const task = snapshot.val();
    const { city, taskId } = context.params;

    if (!task || !task.ownerId) return null;

    console.log("📦 New task created:", taskId, "in", city);

    // 1️⃣ Get task owner name
    const ownerSnap = await admin
      .database()
      .ref(`users/${task.ownerId}`)
      .once("value");

    const ownerName = ownerSnap.val()?.name || "Someone";

    // 2️⃣ Get ALL FCM tokens
    const tokensSnap = await admin
      .database()
      .ref("fcmTokens")
      .once("value");

    if (!tokensSnap.exists()) {
      console.log("⚠️ No FCM tokens found");
      return null;
    }

    const tokens = [];

    tokensSnap.forEach(child => {
      const token = child.val()?.token;
      if (token) tokens.push(token);
    });

    if (tokens.length === 0) {
      console.log("⚠️ No valid tokens");
      return null;
    }

    // 3️⃣ Notification payload
    const payload = {
      notification: {
        title: "SendIt",
        body: `New task from ${ownerName}`,
      },
      data: {
        type: "new_task",
        taskId: taskId,
        city: city,
      },
      android: {
        priority: "high",
        notification: {
          sound: "default",
          channelId: "sendit_tasks",
        },
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
            badge: 1,
          },
        },
      },
    };

    // 4️⃣ Send notification
    const response = await admin.messaging().sendToDevice(tokens, payload);

    console.log("✅ Notifications sent:", response.successCount);

    return null;
  });

const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage, registerFont } = require("canvas");
const logger = require("./logger.utils");

class IDCardGenerator {
  constructor() {
    // Register fonts (you need to install these or use system fonts)
    try {
      registerFont(
        path.join(__dirname, "../assets/fonts/OpenSans-Regular.ttf"),
        { family: "OpenSans" }
      );
      registerFont(path.join(__dirname, "../assets/fonts/OpenSans-Bold.ttf"), {
        family: "OpenSans Bold",
      });
    } catch (error) {
      logger.warn(
        `Font registration error: ${error.message}. Using system fonts.`
      );
    }

    this.width = 650;
    this.height = 400;
    this.cardColors = {
      STUDENT: "#1a73e8",
      LIBRARY: "#188038",
      ALUMNI: "#b31412",
      FACULTY: "#9334e6",
    };
  }

  async generateIDCard(student, idCardData) {
    // Create canvas
    const canvas = createCanvas(this.width, this.height);
    const ctx = canvas.getContext("2d");

    // Fill background
    const cardColor = this.cardColors[idCardData.cardType] || "#1a73e8";
    ctx.fillStyle = cardColor;
    ctx.fillRect(0, 0, this.width, this.height);

    // Add light pattern for security
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    for (let i = 0; i < this.width; i += 20) {
      ctx.fillRect(i, 0, 10, this.height);
    }

    // Add white area for text
    ctx.fillStyle = "white";
    ctx.fillRect(250, 80, 380, 300);

    // Add university logo
    try {
      const logoPath = path.join(__dirname, "../assets/images/logo.png");
      if (fs.existsSync(logoPath)) {
        const logo = await loadImage(logoPath);
        ctx.drawImage(logo, 460, 15, 180, 60);
      } else {
        // Draw text logo if image not available
        ctx.font = "bold 24px OpenSans Bold";
        ctx.fillStyle = "white";
        ctx.fillText("UNIVERSITY NAME", 460, 50);
      }
    } catch (error) {
      logger.error(`Logo error: ${error.message}`);
      // Fallback to text
      ctx.font = "bold 24px Arial";
      ctx.fillStyle = "white";
      ctx.fillText("UNIVERSITY NAME", 460, 50);
    }

    // Add ID card title
    ctx.font = "bold 28px OpenSans Bold";
    ctx.fillStyle = "white";
    ctx.fillText(`${idCardData.cardType} ID CARD`, 20, 50);

    // Add student photo area
    ctx.fillStyle = "#f1f1f1";
    ctx.fillRect(30, 80, 200, 200);
    ctx.strokeStyle = "rgba(0,0,0,0.3)";
    ctx.lineWidth = 1;
    ctx.strokeRect(30, 80, 200, 200);

    // Add "Photo" text in photo area
    ctx.font = "16px OpenSans";
    ctx.fillStyle = "#666";
    ctx.textAlign = "center";
    ctx.fillText("PHOTO", 130, 180);
    ctx.textAlign = "left";

    // Add student details
    ctx.fillStyle = "#333";

    ctx.font = "bold 18px OpenSans Bold";
    ctx.fillText(`${student.firstName} ${student.lastName}`, 270, 120);

    ctx.font = "16px OpenSans";
    ctx.fillText(`Student ID: ${student.studentId}`, 270, 160);
    ctx.fillText(`Card Number: ${idCardData.cardNumber}`, 270, 190);

    // Add institution verification if available
    if (idCardData.institution) {
      ctx.fillStyle = "#3B82F6";  // Blue color for institution info
      ctx.font = "bold 16px OpenSans Bold";
      ctx.fillText(`Institution: ${idCardData.institution}`, 270, 220);
      
      if (idCardData.program) {
        ctx.fillText(`Program: ${idCardData.program}`, 270, 250);
      }
      
      if (idCardData.enrollmentYear) {
        ctx.fillText(`Enrollment Year: ${idCardData.enrollmentYear}`, 270, 280);
      }
      
      // Add verification seal
      ctx.fillStyle = "#10B981";  // Green color for verification
      ctx.font = "bold 14px OpenSans";
      ctx.fillText("INSTITUTION VERIFIED", 270, 320);
      
      // Draw a verification badge
      ctx.beginPath();
      ctx.arc(250, 320, 10, 0, 2 * Math.PI);
      ctx.fillStyle = "#10B981";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(245, 320);
      ctx.lineTo(250, 325);
      ctx.lineTo(255, 315);
      ctx.strokeStyle = "#fff";
      ctx.stroke();
    } else {
      // Existing code for non-verified cards
      if (student.additionalInfo && student.additionalInfo.program) {
        ctx.fillText(`Program: ${student.additionalInfo.program}`, 270, 220);
      }
      
      if (student.additionalInfo && student.additionalInfo.department) {
        ctx.fillText(
          `Department: ${student.additionalInfo.department}`,
          270,
          250
        );
      }
    }

    // Add validity period
    ctx.fillStyle = "#333";
    ctx.fillText(
      `Valid From: ${new Date(idCardData.issueDate).toLocaleDateString()}`,
      270,
      360
    );
    ctx.fillText(
      `Valid Until: ${new Date(idCardData.expiryDate).toLocaleDateString()}`,
      270,
      390
    );

    // Add QR code placeholder
    ctx.fillStyle = "#f1f1f1";
    ctx.fillRect(30, 300, 80, 80);
    ctx.strokeStyle = "rgba(0,0,0,0.3)";
    ctx.strokeRect(30, 300, 80, 80);

    // Add version information if available
    if (idCardData.version && idCardData.version > 1) {
      ctx.fillStyle = "#4F46E5";
      ctx.font = "bold 16px OpenSans";
      ctx.fillText(`Version ${idCardData.version}`, 500, 350);
    }

    // Convert to buffer
    return canvas.toBuffer("image/png");
  }
}

module.exports = new IDCardGenerator();

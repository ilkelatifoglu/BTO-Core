// controllers/tourController.js
const { query } = require("../config/database");
const emailService = require('../services/EmailService');
const { sendEmail } = require("../utils/email");
const { generateCancellationToken } = require("../utils/jwt");

const {
    insertIndividualTour,
} = require("../queries/individualTourQueries");
exports.addIndividualTour = async (req, res) => {
    const {
        name,
        major_of_interest,
        tour_date,
        time,
        number_of_students,
        contact_phone,
        email,
        visitor_notes,
    } = req.body;

    try {
        // Check if a tour with the same email and date already exists
        const existingTour = await query(
            `SELECT id FROM individual_tours WHERE contact_email = $1 AND date = $2`,
            [email, tour_date]
        );

        if (existingTour.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "You already have a tour on this day!",
            });
        }

        const day = new Date(tour_date).toLocaleString("en-GB", { weekday: "long" });
        const tourId = await insertIndividualTour({
            name,
            major_of_interest,
            tour_date,
            day: day.charAt(0).toUpperCase() + day.slice(1),
            time,
            number_of_students: parseInt(number_of_students, 10),
            contact_phone,
            email,
            visitor_notes,
        });

        await emailService.sendIndividualTourConfirmationEmail(email, {
            name,
            tour_date: tour_date,
            time,
        });

        res.status(200).json({
            success: true,
            message: "Tour added successfully",
            tourId,
        });
    } catch (error) {
        console.error("Error adding tour:", error.message || error);
        
        if (error.message === "You already have a tour on this day!") {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        res.status(500).json({
            success: false,
            message: "An error occurred while adding the tour.",
        });
    }
};

exports.getAllIndividualTours = async (req, res) => {
    try {
        const result = await query(`
            SELECT individual_tours.*, 
                   users.first_name AS guide_first_name, 
                   users.last_name AS guide_last_name
            FROM individual_tours
            LEFT JOIN users ON individual_tours.guide_id = users.id
            ORDER BY individual_tours.date DESC
        `);

        res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        console.error("Error fetching individual tours:", error);
        res.status(500).json({ success: false, message: "Failed to fetch individual tours" });
    }
};

// Approve Tour
exports.approveTour = async (req, res) => {
    const { tourId } = req.params;
    const { guide_id } = req.body; // The guide_id to assign the tour to

    try {
        // Check if the tour exists with 'WAITING' status
        const tourResult = await query(`
            SELECT * FROM individual_tours WHERE id = $1 AND tour_status = 'WAITING'
        `, [tourId]);

        if (tourResult.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Tour not found or is not in "WAITING" status.'
            });
        }

        const tour = tourResult.rows[0];
        const { contact_email, date, contact_name } = tour;

        // Update the tour status and guide_id
        await query(`
            UPDATE individual_tours
            SET guide_id = $1, tour_status = 'APPROVED'
            WHERE id = $2
        `, [guide_id, tourId]);

        // Generate a cancellation token
        const cancellationToken = generateCancellationToken(tourId, date, "individual_tour");
        const cancellationLink = `${process.env.FRONTEND_URL}/tours/cancel?token=${cancellationToken}`;

        // Send approval email
        const subject = "Your Tour Has Been Approved";
        const html = `
            <p>Dear ${contact_name},</p>
            <p>We are pleased to inform you that your tour scheduled on <strong>${new Date(date).toLocaleDateString('tr-TR')}</strong> has been approved.</p>
            <p>Your assigned guide will contact you shortly to provide more details.</p>
            <p>If you wish to cancel the tour, please use the link below:</p>
            <a href="${cancellationLink}" style="display: inline-block; padding: 10px 20px; background-color: #d9534f; color: white; text-decoration: none; border-radius: 5px;">Cancel Tour</a>
            <p>Best regards,<br/><strong>Bilkent Information Office Team</strong></p>
        `;

        await sendEmail({
            to: contact_email,
            subject,
            html,
        });

        res.status(200).json({
            success: true,
            message: 'Tour approved successfully, and notification email sent.',
        });
    } catch (error) {
        console.error('Error approving tour:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to approve the tour',
        });
    }
};


// Reject Tour
exports.rejectTour = async (req, res) => {
    const { tourId } = req.params;

    try {
        // Check if the tour exists with 'WAITING' status
        const tourResult = await query(`
            SELECT * FROM individual_tours WHERE id = $1 AND tour_status = 'WAITING'
        `, [tourId]);

        if (tourResult.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Tour not found or is not in "WAITING" status.'
            });
        }

        // Update the tour status to 'REJECTED'
        await query(`
            UPDATE individual_tours
            SET tour_status = 'REJECTED'
            WHERE id = $1
        `, [tourId]);

        res.status(200).json({
            success: true,
            message: 'Tour rejected successfully'
        });
    } catch (error) {
        console.error('Error rejecting tour:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reject the tour'
        });
    }
};

exports.getMyIndividualTours = async (req, res) => {
    const guide_id = req.user.userId; // Assuming you are using an authentication middleware that sets req.user


    if (!guide_id) {
        return res.status(400).json({ success: false, message: "Guide ID is required" });
    }

    try {
        const result = await query(`
            SELECT 
                id, 
                contact_name AS name, -- Corrected from 'name' to 'contact_name'
                tour_size AS number_of_students, 
                date, 
                time, 
                contact_phone, 
                visitor_notes 
            FROM 
                individual_tours
            WHERE 
                guide_id = $1 
                AND tour_status = 'APPROVED'
            ORDER BY 
                date ASC
        `, [guide_id]);

        res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        console.error("Error fetching individual tours for guide:", error);
        res.status(500).json({ success: false, message: "Failed to fetch individual tours" });
    }
};

exports.withdrawFromIndividualTour = async (req, res) => {
    const { id: tourId } = req.params; // Retrieve tour ID from the route parameter
    const guide_id = req.user.userId; // Retrieve user ID from the authentication token

    try {
        // Validate that the tour exists and is assigned to the guide
        const result = await query(
            `SELECT 
                it.*, 
                u.first_name AS guide_first_name, 
                u.last_name AS guide_last_name 
             FROM individual_tours it
             LEFT JOIN users u ON it.guide_id = u.id
             WHERE it.id = $1 AND it.guide_id = $2`,
            [tourId, guide_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Tour not found or not assigned to this guide." });
        }

        await query(
            `UPDATE individual_tours 
             SET guide_id = NULL, tour_status = 'WAITING' 
             WHERE id = $1`,
            [tourId]
        );

        const adminResult = await query(
            `SELECT email FROM users WHERE user_type = 4 AND email IS NOT NULL`
        );
        const adminEmails = adminResult.rows.map(row => row.email);

        const tourDetails = result.rows[0];

        if (adminEmails.length > 0) {
            const subject = "Guide Withdrawn from Individual Tour";
            const formattedDate = new Date(tourDetails.date).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
            const html = `
                <p>Dear Admin,</p>
                <p>The following guide has withdrawn from an individual tour:</p>
                <ul>
                    <li><strong>Guide Name:</strong> ${tourDetails.guide_first_name} ${tourDetails.guide_last_name}</li>
                    <li><strong>Tour ID:</strong> ${tourId}</li>
                    <li><strong>Contact Name:</strong> ${tourDetails.contact_name}</li>
                    <li><strong>Date:</strong> ${formattedDate}</li>
                    <li><strong>Time:</strong> ${tourDetails.time}</li>
                    <li><strong>Tour Size:</strong> ${tourDetails.tour_size}</li>
                </ul>
                <p>The tour status has been updated to "WAITING" and is ready to be reassigned.</p>
                <p>Best regards,<br/>Tour Management System</p>
            `;

            // Send notification email to admins
            try {
                await sendEmail({
                    to: adminEmails.join(","),
                    subject,
                    html
                });
                console.log("Notification emails sent to admins:", adminEmails);
            } catch (emailError) {
                console.error("Failed to send notification emails to admins:", emailError);
            }
        }

        res.status(200).json({ message: "Successfully withdrawn from the individual tour and admins notified." });
    } catch (error) {
        console.error("Error withdrawing from individual tour:", error);
        res.status(500).json({ message: "Failed to withdraw from the tour." });
    }
};

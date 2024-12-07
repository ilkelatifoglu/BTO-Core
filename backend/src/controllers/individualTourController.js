// controllers/tourController.js
const { query } = require("../config/database");

exports.getAllIndividualTours = async (req, res) => {
    try {
        const result = await query(`
            SELECT individual_tours.*, 
                   users.first_name AS guide_first_name, 
                   users.last_name AS guide_last_name
            FROM individual_tours
            LEFT JOIN users ON individual_tours.guide_id = users.id
            ORDER BY individual_tours.date ASC
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

        // Update the tour status and guide_id
        await query(`
            UPDATE individual_tours
            SET guide_id = $1, tour_status = 'APPROVED'
            WHERE id = $2
        `, [guide_id, tourId]);

        res.status(200).json({
            success: true,
            message: 'Tour approved successfully'
        });
    } catch (error) {
        console.error('Error approving tour:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to approve the tour'
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

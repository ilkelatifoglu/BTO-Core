// FeedbackForm.jsx
import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import AssignTourService from "../../services/AssignTourService";
import FeedbackService from "../../services/FeedbackService";

const FeedbackForm = ({ visible, setVisible, initialData }) => {
  const [content, setContent] = useState(initialData?.text_feedback || "");
  const [tours, setTours] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTour, setSelectedTour] = useState(initialData?.tour_id || null);
  const [selectedUsers, setSelectedUsers] = useState(initialData?.all_tagged_users || []);
    const [sendToCandidates, setSendToCandidates] = useState(initialData?.send_to_candidates || false);
  const toast = useRef(null);

  useEffect(() => {
    const fetchTours = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.current.clear();
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Logged-in user ID not found.",
          life: 3000,
        });
        return;
      }

      try {
        const response = await AssignTourService.getToursByUserId(userId);
        const toursData = response.data;
        const formattedTours = toursData.map((tour) => ({
          label: `${tour.school_name} - ${new Date(tour.date).toLocaleDateString()}`,
          value: tour.tour_id,
        }));
        setTours(formattedTours);
      } catch (error) {
        console.error("Error fetching tours:", error);
        toast.current.clear();
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to load tours.",
          life: 3000,
        });
      }
    };

    fetchTours();
  }, []);

  useEffect(() => {
    if (initialData) {
      setContent(initialData.text_feedback || "");
      setSelectedTour(initialData.tour_id || null);
      setSelectedUsers(initialData.all_tagged_users || []);
      setSendToCandidates(initialData.send_to_candidates || false);
    } else {
      resetForm(); // Reset the form for new feedback
    }
  }, [initialData]);

  const fetchUsersByTour = async (tourId) => {
    if (!tourId) {
      setUsers([]);
      return;
    }

    try {
      const response = await AssignTourService.getUsersByTourId(tourId);
      const usersData = response.data;
      const formattedUsers = usersData.map((user) => ({
        label: user.first_name + " " + user.last_name,
        value: user.user_id,
      }));
      setUsers(formattedUsers);
      if (initialData?.tagged_guides) {
        setSelectedUsers(
          formattedUsers.filter((user) => initialData.tagged_guides.includes(user.value))
        );
      }
    } catch (error) {
      console.error("Error fetching users for the tour:", error);
      toast.current.clear();
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load users for the selected tour.",
        life: 3000,
      });
    }
  };

  const handleTourSelection = (tourId) => {
    setSelectedTour(tourId);
    setSelectedUsers([]);
    fetchUsersByTour(tourId);
  };

  const handleSubmit = async () => {
    if (!content || !selectedTour || selectedUsers.length === 0) {
      toast.current.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Please fill in all required fields.",
        life: 3000,
      });
      return;
    }

    const senderId = localStorage.getItem("userId");
    if (!senderId) {
      toast.current.clear();
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Logged-in user ID not found.",
        life: 3000,
      });
      return;
    }

    const feedbackDataAdd = {
      feedback_id: initialData?.feedback_id || null, // Correct naming
      user_ids: selectedUsers,
      tour_id: selectedTour,
      text_feedback: content || null,
      sender_id: parseInt(senderId, 10),
      send_to_candidates: sendToCandidates,
    };

    const feedbackDataEdit = {
      feedback_id: initialData?.feedback_id || null, // Correct naming
      user_ids: selectedUsers.map((user) => parseInt(user.value, 10)),
      tour_id: selectedTour,
      text_feedback: content || null,
      sender_id: parseInt(senderId, 10),
      send_to_candidates: sendToCandidates,
    };

    try {
      const response = feedbackDataEdit.feedback_id
      ? await FeedbackService.updateFeedback(feedbackDataEdit)
      : await FeedbackService.createFeedback(feedbackDataAdd);

      if (response.success) {
        toast.current.clear();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Feedback submitted successfully.",
          life: 3000,
        });
  
        // Delay closing the dialog to ensure the toast displays
        setTimeout(() => {
          setVisible(false);
          resetForm();
        }, 500);
      } else {
        throw new Error("Failed to submit feedback.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.current.clear();
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to submit feedback.",
        life: 3000,
      });
    }
  };

  const resetForm = () => {
    setContent("");
    setSelectedTour(null);
    setSelectedUsers([]);
    setUsers([]);
    setSendToCandidates(false); // Reset to default false
  };

  const renderFooter = () => {
    return (
      <div>
        <Button
          label="Cancel"
          icon="pi pi-times"
          onClick={() => setVisible(false)}
          className="p-button-text"
        />
        <Button
          label="Submit"
          icon="pi pi-check"
          onClick={handleSubmit}
          autoFocus
        />
      </div>
    );
  };

  return (
    <>
      <Toast ref={toast} />
        <Dialog
        header={initialData ? "Edit Feedback" : "New Feedback"}
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
        footer={renderFooter()}
      >
        <div className="p-fluid">
          {/* Render these fields ONLY in Add Mode */}
          {!initialData && (
            <>
              {/* Tour Dropdown */}
              <div className="field mt-4">
                <label htmlFor="tour" className="font-bold">
                  Select Tour
                </label>
                <Dropdown
                  id="tour"
                  value={selectedTour}
                  options={tours}
                  onChange={(e) => handleTourSelection(e.value)}
                  placeholder="Select a tour"
                  className="mt-2"
                  filter
                />
              </div>

              {/* Users MultiSelect */}
              <div className="field mt-4">
                <label htmlFor="users" className="font-bold">
                  Who Do You Want to Associate This Feedback with?
                </label>
                <MultiSelect
                  id="users"
                  value={selectedUsers}
                  options={users}
                  onChange={(e) => setSelectedUsers(e.value)}
                  placeholder="Select users to tag"
                  className="mt-2"
                  filter
                />
              </div>

              {/* Send to Candidates */}
              <div className="field mt-4">
                <label htmlFor="sendToCandidates" className="font-bold">
                  Send Feedback to Candidates?
                </label>
                <div className="mt-2">
                  <input
                    type="radio"
                    id="sendToCandidates"
                    name="sendToCandidates"
                    value={true}
                    checked={sendToCandidates}
                    onChange={() => setSendToCandidates(true)}
                  />
                  <label htmlFor="sendToCandidates" className="ml-2">Yes</label>

                  <input
                    type="radio"
                    id="doNotSendToCandidates"
                    name="sendToCandidates"
                    value={false}
                    checked={!sendToCandidates}
                    onChange={() => setSendToCandidates(false)}
                    className="ml-4"
                  />
                  <label htmlFor="doNotSendToCandidates" className="ml-2">No</label>
                </div>
              </div>
            </>
          )}

          {/* Feedback Textarea - Always Rendered */}
          <div className="field mt-4">
            <label htmlFor="content" className="font-bold">
              Content (Optional)
            </label>
            <InputTextarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="mt-2"
              placeholder="Write your feedback here... (optional)"
            />
          </div>
        </div>
      </Dialog>

    </>
  );
};

export default FeedbackForm;

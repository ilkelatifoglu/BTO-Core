import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import AssignTourService from "../../services/AssignTourService";
import UserService from "../../services/UserService";
import FeedbackService from "../../services/FeedbackService";

const FeedbackForm = () => {
  const [visible, setVisible] = useState(false);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [users, setUsers] = useState([]);
  const [tours, setTours] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const toast = React.useRef(null);

  useEffect(() => {
    // Fetch users and tours data
    const fetchData = async () => {
      try {
        //const toursData = await AssignTourService.getDoneTours(); // No need to await here
        const [usersData, toursData] = await Promise.all([
          UserService.getAllUsers(),
          AssignTourService.getDoneTours()
        ]);
        //console.log("Tours Data:", toursData);
        //console.log("Users:", usersData);

        // Format data for PrimeReact components
        const formattedUsers = usersData.map((user) => ({
          label: user.first_name + " " + user.last_name, // Concatenates with a space in between
          value: user.id,
        }));
        //console.log(formattedUsers);
        const formattedTours = toursData.map((tour) => ({
          label: `${tour.school_name} - ${new Date(tour.date).toLocaleDateString()}`,
          value: tour.tour_id,
        }));
        setUsers(formattedUsers);
        setTours(formattedTours);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to load data",
          life: 3000,
        });
      }
    };

    fetchData();
  }, []);


  const handleSubmit = async () => {
    try {
      // Iterate over selectedUsers and create feedback for each user
      const feedbackPromises = selectedUsers.map(async (userId) => {
        const feedbackData = { user_id: userId, tour_id: selectedTour };
        //console.log(feedbackData);
        // Call the FeedbackService to create feedback
        return await FeedbackService.createFeedback(feedbackData);
      });

      // Wait for all API calls to complete
      const responses = await Promise.all(feedbackPromises);

      // Check if all API calls were successful
      const allSuccessful = responses.every((response) => response.success);

      if (allSuccessful) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Feedback submitted successfully for all users",
          life: 3000,
        });
        setVisible(false);
        resetForm();
      } else {
        throw new Error("Failed to submit feedback for some users");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to submit feedback",
        life: 3000,
      });
    }
  };


  const resetForm = () => {
    setSubject("");
    setContent("");
    setSelectedUsers([]);
    setSelectedTour(null);
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

      <Button
        icon="pi pi-plus"
        className="p-button-rounded p-button-lg"
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          width: "4rem",
          height: "4rem",
        }}
        onClick={() => setVisible(true)}
      />

      <Dialog
        header="New Feedback"
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
        footer={renderFooter()}
      >
        <div className="p-fluid">
          <div className="field">
            <label htmlFor="subject" className="font-bold">
              Subject
            </label>
            <InputText
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-2"
              placeholder="Enter subject"
            />
          </div>

          <div className="field mt-4">
            <label htmlFor="users" className="font-bold">
              Tag Users
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

          <div className="field mt-4">
            <label htmlFor="tour" className="font-bold">
              Related Tour
            </label>
            <Dropdown
              id="tour"
              value={selectedTour}
              options={tours}
              onChange={(e) => setSelectedTour(e.value)}
              placeholder="Select a tour"
              className="mt-2"
              filter
            />
          </div>

          <div className="field mt-4">
            <label htmlFor="content" className="font-bold">
              Content
            </label>
            <InputTextarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="mt-2"
              placeholder="Write your feedback here..."
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default FeedbackForm;

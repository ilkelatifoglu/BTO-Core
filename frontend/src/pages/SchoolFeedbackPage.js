import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; // To parse the token from the URL
import FeedbackService from "../services/FeedbackService"; // Service for handling feedback API calls
import { Toast } from "primereact/toast";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import "./SchoolFeedbackPage.css"; // Custom styles for the page

const SchoolFeedbackPage = () => {
  const [searchParams] = useSearchParams();
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false); // Track token validity
  const [errorMessage, setErrorMessage] = useState(""); // Track error message for invalid token

  const toast = React.useRef(null);

  useEffect(() => {
    const validateToken = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setIsValidToken(false);
        setErrorMessage("Invalid or missing token.");
        return;
      }
  
      try {
        const isValid = await FeedbackService.verifyFeedbackToken(token);
        const feedbackData = await FeedbackService.getFeedbackByToken(token);
        setIsValidToken(isValid);
        if (feedbackData && feedbackData.feedback) {
          setFeedback(feedbackData.feedback); 
        }
      } catch (error) {
        setIsValidToken(false);
        setErrorMessage("Failed to validate feedback token.");
      }
    };
  
    validateToken();
  }, [searchParams]);
  

  const handleSubmit = async () => {
    const token = searchParams.get("token");
    if (!token) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Invalid or missing token.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await FeedbackService.submitFeedback({ token, feedback });
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Thank you for your feedback!",
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail:
          error.response?.data?.message || "Failed to submit feedback. Try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className="feedback-invalid">
        <div className="feedback-container error-state">
          <h1 className="error-title">ERROR!</h1>
          <p className="error-message">
            {errorMessage || "Unable to validate your feedback link."}
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="feedback-page">
      <Toast ref={toast} />
      <div className="feedback-container">
        <h1 className="schoolfb-title">We Value Your Feedback</h1>
        <p className="schoolfb-info">
          Please share your experience with us. Your feedback is very important to us!
        </p>
        <div className="feedback-form">
          <InputTextarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={5}
            cols={40}
            placeholder="Write your feedback here..."
            className="feedback-textarea"
          />
          <Button
            label={isSubmitting ? "Submitting..." : "Submit Feedback"}
            onClick={handleSubmit}
            disabled={isSubmitting || !feedback.trim()}
            className="feedback-submit-button"
          />
        </div>
      </div>
    </div>
  );
};

export default SchoolFeedbackPage;

// import React, { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom"; // To parse the token from the URL
// import FeedbackService from "../services/FeedbackService"; // Service for handling feedback API calls
// import { Toast } from "primereact/toast";
// import { InputTextarea } from "primereact/inputtextarea";
// import { Button } from "primereact/button";

// const SchoolFeedbackPage = () => {
//   const [searchParams] = useSearchParams();
//   const [feedback, setFeedback] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isValidToken, setIsValidToken] = useState(false);
//   const [errorMessage, setErrorMessage] = useState(null);
//   const toast = React.useRef(null);

//   useEffect(() => {
//     const validateToken = async () => {
//       const token = searchParams.get("token");
//       if (!token) {
//         setIsValidToken(false);
//         setErrorMessage("Invalid or missing token.");
//         return;
//       }

//       try {
//         const isValid = await FeedbackService.verifyFeedbackToken(token);
//         setIsValidToken(isValid);
//       } catch (error) {
//         setIsValidToken(false);
//         setErrorMessage(
//           error.response?.data?.message || "Failed to validate feedback token."
//         );
//       }
//     };

//     validateToken();
//   }, [searchParams]);

//   const handleSubmit = async () => {
//     const token = searchParams.get("token");
//     if (!token) {
//       toast.current.show({
//         severity: "error",
//         summary: "Error",
//         detail: "Invalid or missing token.",
//       });
//       return;
//     }

//     try {
//       setIsSubmitting(true);
//       await FeedbackService.submitFeedback({ token, feedback });
//       toast.current.show({
//         severity: "success",
//         summary: "Success",
//         detail: "Thank you for your feedback!",
//       });
//       setFeedback(""); // Clear the feedback input
//     } catch (error) {
//       toast.current.show({
//         severity: "error",
//         summary: "Error",
//         detail:
//           error.response?.data?.message || "Failed to submit feedback. Try again.",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!isValidToken) {
//     return (
//       <div className="feedback-page">
//         <h1>Feedback</h1>
//         <p>{errorMessage || "Unable to validate your feedback link."}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="feedback-page">
//       <Toast ref={toast} />
//       <h1>We Value Your Feedback</h1>
//       <p>
//         Please share your experience with us. Your feedback is very important to us!
//       </p>
//       <div className="feedback-form">
//         <InputTextarea
//           value={feedback}
//           onChange={(e) => setFeedback(e.target.value)}
//           rows={5}
//           cols={40}
//           placeholder="Write your feedback here..."
//         />
//         <Button
//           label={isSubmitting ? "Submitting..." : "Submit Feedback"}
//           onClick={handleSubmit}
//           disabled={isSubmitting || !feedback.trim()}
//           className="p-button-success"
//         />
//       </div>
//     </div>
//   );
// };

// export default SchoolFeedbackPage; // FeedbackService.js
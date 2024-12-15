# S2-T7-agora

[DELIVERABLES](https://github.com/CS319-24-FA/S2-T7-agora/tree/main/Deliverables)

## 1\. Project Title

BTO Core

**Note:** BTO Core is publicly accessible via the following link: https://s2-t7-agora.vercel.app/ _(availability may vary depending on the time period)_.

## 2\. Team Members

* Bertan Uran \- 22102541  
* Ekin Köylü \- 22103867  
* Emre Yazıcıoğlu \- 22201668  
* Egehan Yıldız \- 22203014  
* İlke Latifoğlu \- 22203818  
* Merve Güleç \- 22103231

## 3\. Proposal Description

### 3.1 & 3.2 Motivation and Goals Behind the Project

The project will be implemented to address the need for digitizing activities such as campus tours and fairs organized by Bilkent University's Information Office, and to enhance their current systems.

In the existing system, tours are manually entered using Google Forms and Excel spreadsheets, with confirmations handled through email. This manual process is time-consuming and inefficient, particularly during the approval process, which involves updating spreadsheets and handling tour approvals or rejections via email. Consequently, necessary data recording and analysis for the tours are also done manually. There is a need to automate processes such as tour approval and the transfer of approved tours to guides. By automating these tasks, not only will time be saved, but errors resulting from manual operations will also be minimized. This will create a more efficient system for the Information Office.

Additionally, in the current system, counselors determine which high schools are prioritized for campus tours, which can sometimes result in incorrect prioritization. To address this, an algorithm will be developed to prioritize schools based on criteria provided by the clients.

Another key consideration is data protection, which is of great importance to customers. The system will handle data related to the schools, students, and guides involved in the tours, and it is aimed to present this solution with a user-friendly interface.

### 3.3 Problems That Web Application Will Solve

The primary goal of the Bilkent University Information Office is attracting students of higher academic background continuously. However, with limited resources of time, money, and especially workforce, they have to maximize the utilization of their sources. That’s why this project’s main focus is source management. By sorting schools during prioritization, the optimization of the time, money and workforce will be established for the tours to be organized. Besides, automatization of tour reservations and guide assignments will reduce time loss and human error. Other than that, bringing the necessary functionalities such as different excel sheets, communication between guides to a single place, will also simplify the process tracking for the staff.

### 3.4 Features That the Web Application Will Have

The web application for Bilkent University Information Office will serve multiple types of users, each with different levels of access and functionality. It will aim to facilitate high school tour applications, university fairs, communication, and monitoring processes. Below is a comprehensive description of the web application's features, categorized by user status (before and after login) and specific roles.

#### Before Login

**1\. High School Application Form**

* A form with a UI similar to Google Forms that allows high schools to apply for campus tours.  
* The form prioritizes applications using an algorithm, likely based on the high school’s history, reputation, or specific criteria like past interactions.

**2\. Informational Pages**

* Homepage: A main landing page with key information, news, and important links.  
* About Us: A page detailing the mission and purpose of the Information Office.  
* FAQ: Commonly asked questions and answers about the campus tours and university fairs.  
* News Section: A page for sharing updates on upcoming events, tours, and university fairs.

**3\. Login Entrance**

* A feature for users to access personalized accounts depending on their role within the system.

#### After Login

Once a user logs in, they will be redirected based on their privilege. Different users have distinct features and functionalities.

**1\. Log-in Page and Redirection**

* Different roles include Coordinator, Director, Secretary, Advisor, Guide and Candidate Guides.  
* Users will automatically be directed to the appropriate dashboard based on their privileges.

**2\. Excel Tables (UI) for Different Users**

* Secretary, Coordinator, Director: Full access to view and modify all data, including IBAN and ID.  
* Advisor: View and edit non-sensitive data, excluding IBAN and ID.  
* Guides: Access is limited to their own schedules, assignments, and relevant non-sensitive data.  
* Candidates: Access only to their own personal information, tour schedules, and feedback sections, with no access to sensitive or administrative data.

**3\. Advising Page**

* Information about the advisor and candidate guides.

**4\. High School Application Tracking System**

* An interface for tracking high school applications, like Excel, allows easy data entry and viewing. 

**5\. Feedback Pages**

**5.1 Candidate Guide Feedback**

* After completing their tour, candidate guides will provide feedback about the tour directly to their advisor, detailing their experiences and challenges.
  
**5.2 Guide Feedback on Candidates**  

* The guide oversees the candidate during the tour and will submit feedback to the candidate’s advisor, assessing the candidate's performance and providing any necessary observations.
  
**5.3 High School Feedback**  

* High schools will provide feedback regarding the tour experience, allowing the Information Office to track the success and quality of tours from the visitor's perspective. 

**6\. Fair Management**

* A dedicated page for managing university fairs, allowing coordinators to notify guides about upcoming fairs and manage their participation.

**7\. Puantaj (Time-Tracking) Page**

* A dedicated page where guides can log their work hours for campus tours and individual tours.

**8\. Class Schedules Page**

* A page where guides and advisors can upload their course schedules.

**9\. Data Preservation** 

* A page listing all active guides and their data, which can be used to access data for tours, fairs, and payroll processing automatically.

**10\. Authorized User Registration System**

* A special page for top-access users to register new authorized users to the application system.

**11\. Preferences & Settings**

* A page to change theme, password and to update account details. 

### 3.5 Selling Points of the Web Application

**Automation of Manual Tasks**: One of the primary advantages of this application is its ability to automate tasks that were previously manual, such as tour approval and scheduling. 

**Prioritization Algorithm**: The system incorporates a built-in algorithm that prioritizes tour requests based on specific criteria defined by the client, including YKS rankings and other relevant factors. 

**Role-Based Access Control**: The application ensures that different user roles, such as Director, Secretary, Coordinator, Advisor, Guide, and Candidate Guides, are assigned tailored access levels. For instance, certain users can view and edit sensitive information, such as IBAN numbers, while others have restricted access. 

**Real-Time Communication Platform**: During campus tours, it is crucial for guides to communicate easily and effectively. This part of the application allows guides leading a tour at the same time to easily communicate, ensuring they are aware of each other's location and can take appropriate actions based on that information.

**Streamlined Feedback System**: The application offers a simple mechanism for both candidate and escorting guides to submit feedback. This system promotes transparency and facilitates the evaluation of tours which then helps the Information Office to take actions upon the feedback.

**Enhanced Data Security and Management**: Understanding the importance of data security, the application ensures that all data is securely stored, utilized, and managed efficiently.

**Preferences & Settings**: The application offers a customizable user experience through its Preferences & Settings feature. Users can personalize various aspects, such as enabling dark mode, updating account details, or changing their passwords, making the platform adaptable to individual needs and preferences.

**Easy Navigation**: Designed with user-friendliness in mind, the application ensures easy navigation through its intuitive interface. No matter the type of user, everyone can effortlessly access the tools and information they need which streamlines their experience and improves overall efficiency.

### 3.6 What Makes This Web Application Interesting and Cool

What makes this web application stand out is how it completely transforms the operations of the Information Office. It serves as an all-in-one solution that all staff can seamlessly use in their day-to-day tasks. By automating processes that were once manual, we have developed a solution that is not only efficient but also incredibly user-friendly. This automation removes many of the manual, time-consuming tasks from the equation, allowing the Information Office staff to focus on their current responsibilities instead of navigating complex procedures.

One of the most appealing aspects is its user-centric design, offering role-specific interfaces. Whether you are a guide, coordinator, advisor, or any other role, you will have exactly the tools and information you need at your fingertips—no more, no less. Additionally, the prioritization algorithm ensures that high-demand and target schools of the Information Office are managed fairly and effectively, helping to make the best use of resources—a key issue that needed addressing.

Moreover, features like real-time communication during tours and a secure feedback system for staff create a dynamic and improvement-driven experience. By securing all data and utilizing it efficiently, this application offers not just an all-in-one solution but also resource optimization. All of these features combine to deliver a smooth, professional, and modern service that will elevate the Information Office’s workflow, ensuring their operations are future-proof, easy to maintain, and sustainable.

## 4\. Extra Work

**Real-time Tour Status Page:** A platform designed to enable real-time status updates from guides during tours. Instead of traditional chat, guides will use a special interface with predefined buttons to notify the system of their current location and progress through the tour (e.g., indicating which building they are in).

**Deployment of the application:** The application will be deployed as parts to necessary platforms to meet the user needs and get realized in real life.

**Note:** Two additional features have been added due to the team consisting of six members.

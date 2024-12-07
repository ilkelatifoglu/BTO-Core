import React, { useState } from "react";
import "./SchoolStudent.css";
import { Chart } from 'primereact/chart';

const SchoolStudentChart = ({ data }) => {
  const itemsPerPage = 4; 
  const [currentPage, setCurrentPage] = useState(0);

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const labels = currentData.map((school) => school.school_name);
  const studentSentTotals = currentData.map((school) => parseInt(school.student_sent_last_total, 10) || 0);
  const remainingStudents = currentData.map(
    (school) => (parseInt(school.student_count, 10) || 0) - (parseInt(school.student_sent_last_total, 10) || 0)
  );

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Student Sent',
        backgroundColor: '#007bff', 
        data: studentSentTotals,
        barThickness: 120, 
      },
      {
        label: 'Total Students',
        backgroundColor: '#cccccc', 
        data: remainingStudents,
        barThickness: 120, 
      },
    ],
  };

  const options = {
    indexAxis: 'x',
    scales: {
      x: {
        stacked: true,
        ticks: {
          autoSkip: false,
       Rotation: 90,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Student Count',
        },
      },
    },
    plugins: {
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              const index = tooltipItem.dataIndex;
              const totalStudents = studentSentTotals[index] + remainingStudents[index];

              if (tooltipItem.dataset.label === "Student Sent") {
                return `Student Sent: ${tooltipItem.raw}`;
              } else if (tooltipItem.dataset.label === "Remaining Students") {
                return `Remaining Students: ${tooltipItem.raw}`;
              } else {
                return `Total Students: ${totalStudents}`;
              }
            },
            afterLabel: function (tooltipItem) {
              const index = tooltipItem.dataIndex;
              const totalStudents = studentSentTotals[index] + remainingStudents[index];
          
            },
          },
        },
        legend: {
          position: 'top',
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };

  const handlePrevious = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNext = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
  };

  return (
    <div className="chart-container">
      <div className="chart-title">
        Students Coming from Schools - Students Enrolled in the School
      </div>
      <div className="chart-shadow">
        <Chart
          type="bar"
          data={chartData}
          options={options}
          style={{ height: '400px' }}
        />
      </div>
      <div className="navigation-buttons">
        <button onClick={handlePrevious} disabled={currentPage === 0}>
          &lt;&lt;
        </button>
        <span> Page {currentPage + 1} of {totalPages} </span>
        <button onClick={handleNext} disabled={currentPage === totalPages - 1}>
          &gt;&gt;
        </button>
      </div>
    </div>
  );
};

export default SchoolStudentChart;

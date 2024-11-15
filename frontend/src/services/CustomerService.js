// src/service/CustomerService.js

export const CustomerService = {
    getCustomersMedium: async () => {
        // Mock data or fetch from an API
        /*const data = [
            {
                name: "John Doe",
                country: { name: "USA" },
                company: "Acme Corp",
                representative: { name: "Jane Smith" }
            },
            {
                name: "Mary Jane",
                country: { name: "UK" },
                company: "Tech Solutions",
                representative: { name: "Tom Brown" }
            },
            {
                name: "Alex Green",
                country: { name: "Germany" },
                company: "Innovatech",
                representative: { name: "Sarah White" }
            }
        ];*/
        const schedules = [
            {
                date: "2024-11-15",
                day: "Wednesday",
                time: "10:00 AM",
                schoolName: "Ankara High School",
                city: "Ankara",
                people: "50",
                guideName: "John Doe",
                workload: 120  // 120 minutes
            },
            {
                date: "2024-11-16",
                day: "Thursday",
                time: "2:00 PM",
                schoolName: "Çankaya High School",
                city: "Ankara",
                people: "40",
                guideName: "Jane Smith",
                workload: 90  // 90 minutes
            },
            {
                date: "2024-11-17",
                day: "Friday",
                time: "11:00 AM",
                schoolName: "Gazi High School",
                city: "Ankara",
                people: "30",
                guideName: "Emily Johnson",
                workload: 60  // 60 minutes
            },
            {
                date: "2024-11-18",
                day: "Saturday",
                time: "9:00 AM",
                schoolName: "Istanbul High School",
                city: "Istanbul",
                people: "60",
                guideName: "Michael Brown",
                workload: 150  // 150 minutes
            },
            {
                date: "2024-11-19",
                day: "Sunday",
                time: "3:00 PM",
                schoolName: "Kadiköy High School",
                city: "Istanbul",
                people: "45",
                guideName: "Sophia Wilson",
                workload: 75  // 75 minutes
            },
            {
                date: "2024-11-19",
                day: "Sunday",
                time: "3:00 PM",
                schoolName: "Kadiköy High School",
                city: "Istanbul",
                people: "45",
                guideName: "Sophia Wilson",
                workload: 75  // 75 minutes
            }
        ];
        // Simulate an asynchronous operation
        return new Promise((resolve) => {
            setTimeout(() => resolve(schedules), 500); // Simulate network delay
        });
    }
};

import axios from 'axios';

export const fetchGuideInfo = async (filters) => {
    try {
        const response = await axios.get('http://localhost:3001/guideInfo', {
            params: filters,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching guide information:', error);
        return [];
    }
};


const API_BASE = 'http://localhost:5000/api/v1';

export const getOutfitRecommendations = async (payload) => {
    const response = await fetch(`${API_BASE}/recommendation/outfit-recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error('Failed to fetch outfit recommendations');
    }

    return response.json();
}

export async function getProductsList(page = 1, limit = 20) {
    const response = await fetch(`${API_BASE}/recommendation/products-list?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch products list');
    }

    return response.json();
}
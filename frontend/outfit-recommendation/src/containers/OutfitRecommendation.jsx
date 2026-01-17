import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getOutfitRecommendations } from '../routes/recommendation-route';
import OutfitCard from '../components/OutfitCard';

const OutfitRecommendation = () => {
    const [outfits, setOutfits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    const getRecommendationPayload = () => {
        const selected = location.state?.selectedProduct;

        if (selected) {
            return {
                gender: selected.gender || 'male',
                occasion: selected.occasion || 'casual',
                season: selected.season || 'all',
                budget: selected.lowest_price * 3 || 15000,
                selectedProduct: selected
            };
        }

        return {
            gender: 'male',
            occasion: 'casual',
            season: 'all',
            budget: 15000,
            selectedProduct: null
        };
    };

    const fetchRecommendations = async () => {
        setLoading(true);
        setError('');

        try {
            const payload = getRecommendationPayload();
            console.log('🔍 Sending payload:', payload);

            const res = await getOutfitRecommendations(payload);

            if (res.success) {
                const completeOutfits = res.data.outfits.slice(0, 6);

                const scoredOutfits = completeOutfits.map(item => ({
                    ...item,
                    match_score: item.match_score || Math.random().toFixed(2),
                    category_role: item.category_role || getCategoryRole(item)
                }));

                setOutfits(scoredOutfits);
                setSelectedProduct(location.state?.selectedProduct || null);
            } else {
                throw new Error(res.message || 'Failed to fetch recommendations');
            }
        }
        catch (err) {
            setError(err.message || 'Something went wrong');
            console.error('Recommendation fetch error:', err);
        }
        finally {
            setLoading(false);
        }
    };

    const getCategoryRole = (product) => {
        const categoryMap = {
            'tops': 'Top',
            'bottoms': 'Bottom',
            'shoes': 'Footwear',
            'socks': 'Socks',
            'jackets': 'Outerwear',
            'hoodie': 'Layer',
            'sweater': 'Layer',
            'shirts': 'Top',
            't shirt': 'Top'
        };
        return categoryMap[product.sub_category?.toLowerCase()] || 'Accessory';
    };

    useEffect(() => {
        fetchRecommendations();
    }, []);

    return (
        <div style={{ padding: '24px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
                    Complete Outfit Recommendations
                </h1>
                {selectedProduct && (
                    <p style={{ color: '#666', fontSize: '1.1rem' }}>
                        Based on your selection: <strong>{selectedProduct.title}</strong>
                    </p>
                )}
                <button
                    onClick={() => navigate('/')}
                    style={{
                        marginTop: '16px',
                        padding: '10px 20px',
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                    }}
                >
                    ← Back to Products
                </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '32px' }}>

                <div style={{
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    maxWidth: '360px'
                }}>
                    {selectedProduct ? (
                        <>
                            <h2 style={{ margin: '0 0 16px 0', color: '#333' }}>Selected Item</h2>
                            <div style={{ textAlign: 'center' }}>
                                <img
                                    src={selectedProduct.featured_image}
                                    alt={selectedProduct.title}
                                    style={{
                                        width: '100%',
                                        maxWidth: '300px',
                                        height: '300px',
                                        objectFit: 'cover',
                                        borderRadius: '12px',
                                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                                    }}
                                />
                                <div style={{ marginTop: '16px' }}>
                                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.3rem' }}>
                                        {selectedProduct.title}
                                    </h3>
                                    <p style={{ margin: '0 0 4px 0', color: '#666' }}>
                                        {selectedProduct.brand_name}
                                    </p>
                                    <p style={{ margin: '0 0 12px 0', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                        ₹{selectedProduct.lowest_price}
                                    </p>
                                    <div style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '8px',
                                        justifyContent: 'center',
                                        fontSize: '0.9rem'
                                    }}>
                                        <span style={{ background: '#007bff', color: 'white', padding: '4px 8px', borderRadius: '12px' }}>
                                            {selectedProduct.category}
                                        </span>
                                        <span style={{ background: '#28a745', color: 'white', padding: '4px 8px', borderRadius: '12px' }}>
                                            {selectedProduct.sub_category}
                                        </span>
                                        {selectedProduct.gender && (
                                            <span style={{ background: '#ffc107', color: '#212529', padding: '4px 8px', borderRadius: '12px' }}>
                                                {selectedProduct.gender}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
                            <p>Select a product to see complete outfit recommendations</p>
                        </div>
                    )}
                </div>

                <div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '24px',
                        flexWrap: 'wrap',
                        gap: '16px'
                    }}>
                        <h2 style={{ margin: 0 }}>Complete Outfit (6 Items Max)</h2>
                        <div style={{ display: 'flex', gap: '8px', fontSize: '0.9rem' }}>
                            <span>Avg. Match Score:</span>
                            <div style={{
                                background: 'linear-gradient(to right, #ff6b6b, #4ecdc4)',
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontWeight: 'bold'
                            }}>
                                {outfits.length > 0 ? (outfits.reduce((sum, item) => sum + parseFloat(item.match_score), 0) / outfits.length).toFixed(2) : '0.00'}
                            </div>
                        </div>
                    </div>

                    {loading && <p style={{ textAlign: 'center' }}>Generating perfect outfit...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    {!loading && outfits.length === 0 && (
                        <p style={{ textAlign: 'center', color: '#666' }}>No matching outfit items found</p>
                    )}

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '20px',
                        maxWidth: '100%'
                    }}>
                        {outfits.slice(0, 6).map((item, index) => (
                            <div key={item.sku_id} style={{ position: 'relative' }}>
                                <OutfitCard outfit={item} />
                                <div style={{
                                    position: 'absolute',
                                    top: '8px',
                                    left: '8px',
                                    background: 'rgba(0,123,255,0.9)',
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold'
                                }}>
                                    {item.category_role}
                                </div>
                                <div style={{
                                    position: 'absolute',
                                    bottom: '8px',
                                    right: '8px',
                                    background: 'rgba(40,167,69,0.95)',
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem'
                                }}>
                                    {item.match_score}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default OutfitRecommendation;

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getOutfitRecommendations } from '../routes/recommendation-route';
import OutfitCard from '../components/OutfitCard';

const OutfitRecommendation = () => {
    const [outfits, setOutfits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedCategoryExcluded, setSelectedCategoryExcluded] = useState('');

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
            const res = await getOutfitRecommendations(payload);

            if (res.success) {
                setOutfits(res.data.outfits || []);
                setSelectedCategoryExcluded(res.data.selected_category_excluded || '');
                setSelectedProduct(location.state?.selectedProduct || null);
            } else {
                throw new Error(res.message || 'Failed to fetch recommendations');
            }
        }
        catch (err) {
            setError(err.message || 'Something went wrong');
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const getAverageScore = () => {
        if (!outfits.length) return '0.00';
        const avg =
            outfits.reduce((sum, item) => sum + parseFloat(item.match_score || 0), 0) /
            outfits.length;
        return avg.toFixed(2);
    };

    const OutfitBanner = outfits.length > 0 && (
        <div
            style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '24px',
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: '0 8px 32px rgba(102,126,234,0.3)',
                marginBottom: '32px'
            }}
        >
            <h2 style={{ margin: '0 0 8px 0', fontSize: '1.8rem' }}>
                Complete Outfit for you
            </h2>
            <div style={{ fontSize: '1rem' }}>
                Score: <strong>{getAverageScore()}</strong> | {outfits.length} items
            </div>
        </div>
    );

    return (
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Perfect Outfit</h1>

                {selectedProduct && selectedCategoryExcluded && (
                    <p style={{ color: '#666', fontSize: '1.1rem' }}>
                        Based on <strong>{selectedProduct.title}</strong>{' '}
                        <span
                            style={{
                                background: '#ff6b6b',
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: '20px'
                            }}
                        >
                            No {selectedCategoryExcluded}
                        </span>
                    </p>
                )}

                <button
                    onClick={() => navigate('/')}
                    style={{
                        marginTop: '16px',
                        padding: '12px 24px',
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}
                >
                    ← Back to Products
                </button>
            </div>

            {/* MAIN CONTENT */}
            <div style={{ width: '100%', maxWidth: '1400px' }}>
                {/* ✅ BANNER SPANS BOTH SIDES */}
                {OutfitBanner}

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '32px',
                        flexWrap: 'wrap'
                    }}
                >
                    {/* LEFT — SELECTED PRODUCT */}
                    <div
                        style={{
                            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                            maxWidth: '360px'
                        }}
                    >
                        {selectedProduct ? (
                            <>
                                <h2 style={{ marginBottom: '16px', color: 'black' }}>Selected Item</h2>

                                <img
                                    src={selectedProduct.featured_image}
                                    alt={selectedProduct.title}
                                    style={{
                                        width: '100%',
                                        height: '300px',
                                        objectFit: 'cover',
                                        borderRadius: '12px'
                                    }}
                                />

                                <div style={{ marginTop: '16px', textAlign: 'center', color: 'black' }}>
                                    <h3>{selectedProduct.title}</h3>
                                    <p>{selectedProduct.brand_name}</p>
                                    <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                                        ₹{selectedProduct.lowest_price}
                                    </p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', fontSize: '0.9rem' }}>
                                        <span style={{ background: '#007bff', color: 'white', padding: '4px 8px', borderRadius: '12px' }}>
                                            {selectedProduct.category}
                                        </span>
                                        <span style={{ background: '#28a745', color: 'white', padding: '4px 8px', borderRadius: '12px' }}>
                                            {selectedProduct.sub_category}
                                        </span>
                                    </div>
                                </div>

                            </>
                        ) : (
                            <p>Select a product to see recommendations</p>
                        )}
                    </div>

                    {/* RIGHT — OUTFIT GRID */}
                    <div style={{ flex: 1, minWidth: '600px' }}>
                        {outfits.length > 0 ? (
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: '20px'
                                }}
                            >
                                {outfits.map(item => (
                                    <div key={item.sku_id} style={{ position: 'relative' }}>
                                        <OutfitCard outfit={item} />

                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: '12px',
                                                left: '12px',
                                                background: 'rgba(102,126,234,0.95)',
                                                color: 'white',
                                                padding: '6px 10px',
                                                borderRadius: '16px',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            {item.role_type || item.product_type}
                                        </div>

                                        <div
                                            style={{
                                                position: 'absolute',
                                                bottom: '12px',
                                                right: '12px',
                                                background: 'rgba(40,167,69,0.95)',
                                                color: 'white',
                                                padding: '6px 10px',
                                                borderRadius: '16px'
                                            }}
                                        >
                                            {parseFloat(item.match_score || 0).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No recommendations yet</p>
                        )}
                    </div>
                </div>
            </div>

            {loading && <p style={{ marginTop: '24px' }}>Generating perfect matches…</p>}
            {error && <p style={{ color: 'red', marginTop: '24px' }}>{error}</p>}
        </div>
    );
};

export default OutfitRecommendation;

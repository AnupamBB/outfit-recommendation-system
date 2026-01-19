import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductsList } from '../routes/recommendation-route';
import ListOutfitCard from '../components/listOutfitCard';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const hasFetchedOnce = useRef(false);

    const fetchProducts = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        setError('');

        try {
            const res = await getProductsList(page, 20);

            if (res.success) {
                setProducts(prev => [...prev, ...res.data]);
                const receivedCount = res.data.length;
                if (receivedCount < 20 || res.pagination.filteredNote) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                    setPage(prev => prev + 1);
                }
            } else {
                setError('Failed to load products');
            }
        }
        catch (err) {
            setError(err.message || 'Something went wrong');
        }
        finally {
            setLoading(false);
        }
    };

    const handleProductClick = (product) => {
        const payload = {
            gender: product.gender || 'male',
            occasion: product.occasion || 'casual',
            season: product.season || 'all',
            budget: product.lowest_price * 3 || 15000 // Complete outfit budget
        };

        navigate('/recommendations', {
            state: {
                selectedProduct: product,
                filters: payload
            }
        });
    };


    useEffect(() => {
        if (hasFetchedOnce.current) return;
        hasFetchedOnce.current = true;
        fetchProducts();
    }, []);

    return (
        <div style={{ padding: '24px', paddingLeft: '10%', paddingRight: '10%' }}>
            <h1 style={{ "text-align": "center" }}>Available Products</h1>


            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '16px',
                    marginTop: '20px',
                    justifyContent: 'center',
                }}
            >
                {products.map(item => (
                    <div
                        key={item.sku_id}
                        onClick={() => handleProductClick(item)}
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '16px',
                            marginTop: '20px',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            ':hover': {
                                transform: 'scale(1.02)'
                            }
                        }}
                    >
                        <ListOutfitCard outfit={item} />
                    </div>

                ))}

            </div>

            {loading && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <p>Loading more products...</p>
                </div>
            )}

            {hasMore && !loading && (
                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <button
                        onClick={fetchProducts}
                        style={{
                            padding: '12px 24px',
                            fontSize: '16px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                        disabled={loading}
                    >
                        View More Products
                    </button>
                </div>
            )}

            {!hasMore && products.length > 0 && (
                <div style={{
                    textAlign: 'center',
                    marginTop: '40px',
                    padding: '20px',
                    color: '#666',
                    fontStyle: 'italic'
                }}>
                    <p>You've viewed all available products!</p>
                    <p style={{ marginTop: '8px', fontSize: '14px' }}>
                        Total: {products.length} products displayed
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProductList;
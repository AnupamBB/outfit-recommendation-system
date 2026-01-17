import './OutfitCard.css';

function OutfitCard({ outfit }) {
    if (!outfit) return null;

    return (
        <div className="outfit-card">
            <div className="outfit-image">
                {/* 👇 FIXED: Use featured_image instead of image */}
                <img
                    src={outfit.featured_image}  // ← Backend sends featured_image
                    alt={outfit.title}
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200x200/gray/white?text=No+Image';
                    }}
                />
            </div>

            <div className="outfit-info">
                <h3 className="outfit-title">{outfit.title}</h3>

                <p className="outfit-brand">{outfit.brand_name}</p>

                <p className="outfit-category">
                    {outfit.category} · {outfit.sub_category}
                </p>

                {/* 👇 FIXED: Use lowest_price instead of price */}
                <p className="outfit-price">
                    ₹{outfit.lowest_price > 0 ? outfit.lowest_price : 'N/A'}
                </p>
            </div>
        </div>
    );
}

export default OutfitCard;

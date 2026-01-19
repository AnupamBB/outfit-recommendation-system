import React from 'react';

const ListOutfitCard = ({ outfit }) => {
    return (
        <div style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '10px',
            textAlign: 'center',
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            width: '100%',
            maxWidth: '220px',
            boxSizing: 'border-box',
        }}>
            <img
                src={outfit.featured_image}
                alt={outfit.title}
                style={{
                    width: '180px',
                    height: '180px',
                    objectFit: 'contain',
                    borderRadius: '6px'
                }}
            />
            <h4 style={{ margin: '10px 0 5px', fontSize: '14px', color: '#797979' }}>{outfit.title}</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#555' }}>{outfit.brand_name}</p>
            <p style={{ margin: '5px 0 0', fontWeight: 'bold', color: 'black' }}>
                ₹{outfit.lowest_price || 'N/A'}
            </p>
            <p style={{ fontSize: '12px', color: '#777', marginTop: '4px' }}>
                {outfit.category} / {outfit.sub_category}
            </p>
        </div>
    );
};

export default ListOutfitCard;

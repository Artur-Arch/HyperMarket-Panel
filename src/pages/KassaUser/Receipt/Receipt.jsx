import React from 'react';
import './receipt.css';

const Receipt = React.forwardRef(({ order, onClose }, ref) => {
  const total = order.reduce((sum, item) => {
    if (!item || typeof item.price !== 'number' || typeof item.quantity !== 'number') return sum;
    return sum + item.price * item.quantity;
  }, 0);

  return (
    <div className="receipt58mm" ref={ref}>
      <h2>🧾 SOTUV CHEKI</h2>
      <hr />
      {order.map((item) =>
        item ? (
          <div key={item.id || Math.random()} className="receipt-item">
            <div>{item.name || 'Noma‘lum mahsulot'}</div>
            <div>
              {item.quantity} x {item.price?.toLocaleString?.() || 0} ={' '}
              {(item.quantity * item.price || 0).toLocaleString()}
            </div>
          </div>
        ) : null
      )}
      <hr />
      <div className="total">Jami: {total.toLocaleString()} so'm</div>
      <p>Rahmat! 😊</p>
      {onClose && <button onClick={onClose}>Yopish</button>}
    </div>
  );
});

export default Receipt;

import React from 'react';

const Menyu = () => {
  const user = localStorage.getItem('user');
  return (
    <div style={{ padding: '40px', fontSize: '24px' }}>
      <h2>Assalomu alaykum, {user || 'Kasir'}!</h2>
      <p>Bu — kasirning boshqaruv paneli.</p>
    </div>
  );
};

export default Menyu;

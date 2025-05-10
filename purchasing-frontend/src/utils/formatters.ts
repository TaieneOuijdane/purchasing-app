export const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice.toLocaleString('fr-MA', {
      style: 'currency',
      currency: 'MAD'
    });
  };

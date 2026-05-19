function mapProduct(row: Record<string, unknown>): Product {
  // Safely extract images - handles TEXT[], JSON, or single string
  const rawImages = row.images;
  let images: string[] = [];

  if (Array.isArray(rawImages)) {
    images = rawImages.filter(
      (url): url is string => typeof url === 'string' && url.length > 0,
    );
  } else if (typeof rawImages === 'string') {
    // Single string URL or JSON array string
    try {
      const parsed = JSON.parse(rawImages);
      images = Array.isArray(parsed) ? parsed : [rawImages];
    } catch {
      images = rawImages ? [rawImages] : [];
    }
  }

  return {
    id: String(row.id),
    name: (row.product_name as string) || '',
    description: (row.description as string) || '',
    price: Number(row.price) || 0,
    images,
    category: (row.category as string) || '',
    stock: Number(row.stocks) || 0,
    rating: Number(row.rating) || 0,
    reviews: Number(row.reviews) || 0,
    featured: Boolean(row.featured),
    created_at: (row.created_at as string) || '',
  };
}

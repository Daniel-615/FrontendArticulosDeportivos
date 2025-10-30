const API_GATEWAY = import.meta.env.VITE_API_GATEWAY

/**
 * Constructs a full image URL from a relative path or returns the URL as-is if already absolute
 * @param {string} imagePath - The image path from the backend (can be relative or absolute)
 * @param {string} fallback - Fallback placeholder image
 * @returns {string} - Full image URL
 */
export const getImageUrl = (imagePath, fallback = null) => {
  // If no image path provided, return fallback
  if (!imagePath) {
    return fallback || "/generic-sports-product.png"
  }

  // If it's already an absolute URL (http:// or https://), return as-is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath
  }

  // If it's a placeholder, return as-is
  if (imagePath.startsWith("/placeholder.svg")) {
    return imagePath
  }

  // If it starts with /, it's a relative path from the public folder
  if (imagePath.startsWith("/")) {
    return imagePath
  }

  // Otherwise, construct the full URL using the API gateway
  // Remove trailing slash from API_GATEWAY if present
  const baseUrl = API_GATEWAY?.endsWith("/") ? API_GATEWAY.slice(0, -1) : API_GATEWAY

  // Remove leading slash from imagePath if present to avoid double slashes
  const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath

  return `${baseUrl}/${cleanPath}`
}

/**
 * Gets product image URL with proper fallback
 * @param {object} producto - Product object
 * @returns {string} - Image URL
 */
export const getProductImageUrl = (producto) => {
  const imagePath = producto?.productoColor?.imagenUrl || producto?.colores?.[0]?.imagenUrl || producto?.imagen || null

  const fallback = `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(producto?.nombre || "producto deportivo")}`

  return getImageUrl(imagePath, fallback)
}

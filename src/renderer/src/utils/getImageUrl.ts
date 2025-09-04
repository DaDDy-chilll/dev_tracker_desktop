export const getImageUrl = (image: string): string => {
  const isDevelopment = import.meta.env.DEV
  return `${isDevelopment ? 'http://localhost:5001/images' : 'http://dev-track-api.myancare/images'}${image}`
}

export const getImageUrl = (image: string): string => {
  return `${process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : 'http://dev-track-api.myancare'}${image}`
}

export const parseHashTokens = (hash: string) => {
  if (!hash) return null

  try {
    const hashParams = new URLSearchParams(hash.substring(1)) // Remove '#'
    const accessToken = hashParams.get("access_token")
    const refreshToken = hashParams.get("refresh_token")

    if (accessToken && refreshToken) {
      return { accessToken, refreshToken }
    } else {
      return null
    }
  } catch (error) {
    console.error("Error parsing hash tokens:", error)
    return null
  }
}


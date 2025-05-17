export async function getUserCountry() {
  try {
    const response = await fetch("https://ipinfo.io/json?token=d1b1857fe3e158");
    if (!response.ok) {
      if (response.status === 429) {
        console.warn("Превышен лимит запросов к API геолокации");
      }
      throw new Error("Ошибка при получении геолокации");
    }

    const data = await response.json();

    return `${data.region}/${data.country}`;
  } catch (error) {
    console.error("Ошибка:", error);
    return null;
  }
}

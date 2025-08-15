export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  
  console.log('API Route called with query:', query);
  
  if (!query || query.length < 2) {
    console.log('Query too short, returning empty results');
    return Response.json({ predictions: [], status: 'OK' });
  }

  const GOOGLE_PLACES_API_KEY = "AIzaSyC391QVA3pQwHCTknJxUmWmK07l0G1Uqzc";
  
  // Önce Places Autocomplete API'yi deneyelim (daha zengin öneriler için)
  const autocompleteUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json`;
  const autocompleteParams = new URLSearchParams({
    input: query,
    key: GOOGLE_PLACES_API_KEY,
    location: '41.0082,28.9784', // İstanbul merkez
    radius: '50000', // 50km yarıçap
    language: 'tr',
    components: 'country:tr',
    types: 'establishment|geocode' // Hem işletmeler hem adresler
  });

  console.log('Trying Autocomplete API with query:', query);

  try {
    // Autocomplete API'yi dene
    const autocompleteResponse = await fetch(`${autocompleteUrl}?${autocompleteParams.toString()}`);
    
    if (autocompleteResponse.ok) {
      const autocompleteData = await autocompleteResponse.json();
      console.log('Autocomplete API Response:', autocompleteData);
      
      if (autocompleteData.status === 'OK' && autocompleteData.predictions?.length > 0) {
        // Autocomplete başarılı, sonuçları döndür
        return Response.json({
          status: 'OK',
          predictions: autocompleteData.predictions
        });
      }
    }
  } catch (error) {
    console.log('Autocomplete API failed, trying Text Search:', error);
  }

  // Autocomplete başarısızsa veya sonuç yoksa, Text Search API'yi dene
  const textSearchUrl = `https://places.googleapis.com/v1/places:searchText`;
  
  const requestBody = {
    textQuery: query,
    locationBias: {
      circle: {
        center: {
          latitude: 41.0082,
          longitude: 28.9784
        },
        radius: 50000
      }
    },
    maxResultCount: 15,
    languageCode: "tr",
    regionCode: "TR"
  };

  console.log('Trying Text Search API with body:', JSON.stringify(requestBody, null, 2));

  try {
    const response = await fetch(textSearchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.types,places.id'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Text Search API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Text Search API response not ok:', response.status, response.statusText, errorText);
      
      // Hata durumunda bile boş sonuç döndür, 500 hatası verme
      return Response.json({ 
        status: 'OK', 
        predictions: [] 
      });
    }

    const data = await response.json();
    console.log('Text Search API Response data:', JSON.stringify(data, null, 2));
    
    // Convert new API format to our expected format
    const convertedData = {
      status: 'OK',
      predictions: data.places ? data.places.map((place, index) => ({
        place_id: place.id || `place_${index}`,
        description: place.formattedAddress || place.displayName?.text || '',
        structured_formatting: {
          main_text: place.displayName?.text || '',
          secondary_text: place.formattedAddress || ''
        },
        types: place.types || []
      })) : []
    };
    
    return Response.json(convertedData);
    
  } catch (error) {
    console.error('Google Places API error:', error);
    // Hata durumunda bile 200 döndür ama boş sonuçla
    return Response.json({ 
      status: 'OK', 
      predictions: [],
      error: error.message 
    });
  }
}
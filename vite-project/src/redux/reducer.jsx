
const frameworkNames = [
  'angular', 'backbone', 'ember', 'react', 'vue',
  'jquery', 'meteor', 'node', 'aurelia', 'vanillajs',
  'typescript', 'svelte'
];


const initialState = {
  frameworks: [], // Kartları tutacak dizi
  opened: [],     // Açılmış kartların indeksleri
  score: 0,       // Kullanıcının puanı
};

// Fisher-Yates algoritması ile karıştırma fonksiyonu
function shuffle(array) {
  const cloned = [...array];
  for (let i = cloned.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]]; 
  }
  return cloned;
}

// Reducer fonksiyonu
function reducer(state = initialState, action) {
  switch (action.type) {

    case 'INIT_CARDS': {
      // Kartları çift olarak oluştur (her framework'ten iki tane)
      const pairCards = [...frameworkNames, ...frameworkNames].map(name => ({
        name,
        close: true,      
        complete: false, 
      }));

      const shuffled = shuffle(pairCards); // Kartları karıştır

      // Rastgele bir konuma boş bir kart yerleştir (oyunu şaşırtıcı hale getirir)
      const emptyCard = { name: 'empty', close: true, complete: true };
      shuffled.splice(Math.floor(Math.random() * 25), 0, emptyCard);

      // Yeni state'i döndür
      return {
        ...state,
        frameworks: shuffled.slice(0, 25), // İlk 25 kart alınır
        opened: [],
        score: 0,
      };
    }

    case 'OPEN_CARD': {
      // Eğer zaten 2 kart açıksa, aynı karta tıklanmışsa veya kart zaten eşleşmişse işlem yapma
      if (
        state.opened.length === 2 ||
        state.opened.includes(action.index) ||
        state.frameworks[action.index].complete === true
      ) {
        return state;
      }

      // Kartın açık hale getirilmesi
      const updatedFrameworks = [...state.frameworks];
      updatedFrameworks[action.index] = {
        ...updatedFrameworks[action.index],
        close: false,
      };

      return {
        ...state,
        frameworks: updatedFrameworks,
        opened: [...state.opened, action.index], // Açılan kartı listeye ekle
      };
    }

    case 'CHECK_MATCH': {
      // 2 kart açılmadan kontrol yapılmasın
      if (state.opened.length !== 2) return state;

      const [first, second] = state.opened;
      const frameworks = [...state.frameworks];
      const firstCard = frameworks[first];
      const secondCard = frameworks[second];
      let scoreChange = 0;

      if (
        firstCard.name !== 'empty' &&
        secondCard.name !== 'empty' &&
        firstCard.name === secondCard.name
      ) {
        // Kartlar eşleşti
        frameworks[first] = { ...firstCard, complete: true };
        frameworks[second] = { ...secondCard, complete: true };
        scoreChange = 50; 
      } else {
        // Kartlar eşleşmedi
        frameworks[first] = { ...firstCard, close: true };
        frameworks[second] = { ...secondCard, close: true };
        scoreChange = -10; 
      }

      return {
        ...state,
        frameworks,
        opened: [], // Açık kartlar sıfırlanır
        score: state.score + scoreChange,
      };
    }

    default:
      return state; 
  }
}

export default reducer;

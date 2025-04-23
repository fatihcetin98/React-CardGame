import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; 
import Card from './components/card'; 
import './App.css'; 

const App = () => {
  const dispatch = useDispatch(); // Redux'a action göndermek için

 
  const frameworks = useSelector(state => state.frameworks); // Kartlar
  const opened = useSelector(state => state.opened);         // Açılan kart indeksleri
  const score = useSelector(state => state.score);           // Kullanıcının skoru

  // Kart tıklama işlemi
  const handleClick = (name, index) => {
    // Sadece kapalı ve eşleşmemiş kartlara tıklanabilir
    if (frameworks[index].close && !frameworks[index].complete) {
      dispatch({ type: 'OPEN_CARD', name, index });
    }
  };

  
  useEffect(() => {
    dispatch({ type: 'INIT_CARDS' });
  }, [dispatch]);

  // İki kart açıldığında eşleşme kontrolünü tetikle
  useEffect(() => {
    if (opened.length === 2) {
      setTimeout(() => {
        dispatch({ type: 'CHECK_MATCH' }); 
      }, 750);
    }
  }, [opened, dispatch]);

  // Oyunun bitip bitmediğini kontrol et
  const allMatched =
    frameworks.length > 0 &&
    frameworks.every(card => card.complete || card.name === 'empty');

  // Yeniden başlat butonuna basıldığında kartları sıfırla
  const handleRestart = () => {
    dispatch({ type: 'INIT_CARDS' });
  };

  return (
    <div id="app">
      <h2>Skor: {score}</h2>

      {/* Kartların bulunduğu alan */}
      <div className="playground">
        {frameworks.map((framework, index) => (
          <Card
            key={index}
            framework={framework}
            onClick={() => handleClick(framework.name, index)}
          />
        ))}
      </div>

      {/* Tüm kartlar eşleştiğinde oyun bitiş ekranı */}
      {allMatched && (
        <button className="restart-button" onClick={handleRestart}>
          🔄 Yeniden Oyna
        </button>
      )}
    </div>
  );
};

export default App;

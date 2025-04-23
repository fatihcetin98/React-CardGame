import React from 'react';

// Props olarak: framework (kart verisi) ve onClick (tıklama işlemi) alır
const Card = ({ framework, onClick }) => {
  const cardClass = `card${!framework.close ? ' opened' : ''}${framework.complete ? ' matched' : ''}${framework.name === 'empty' ? ' empty' : ''}`;

  return (
    <div className={cardClass} onClick={onClick}>
      <div className="front">?</div>
      <div className="back">
        {framework.name !== 'empty' && (
          <img
            src={`https://raw.githubusercontent.com/samiheikki/javascript-guessing-game/master/static/logos/${framework.name}.png`}
            alt={framework.name}
          />
        )}
      </div>
    </div>
  );
};

export default Card;
import React, { useState } from 'react';
const Carousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const categories = [
    {
      title: 'Maths',
      description: 'Dota 2 is a multiplayer online battle arena by Valve. The game is a sequel to Defense of the Ancients, which was a community-created mod for Blizzard Entertainment\'s Warcraft III.',
      imageUrl: 'https://www.uregina.ca/academics/assets/images/heros/science/math_ds2-1600x1060.jpg',
    },
    {
      title: 'Science',
      description: 'The Witcher 3 is a multiplayer online battle arena by Valve. The game is a sequel to Defense of the Ancients, which was a community-created mod for Blizzard Entertainment\'s Warcraft III.',
      imageUrl: 'https://www.mq.edu.au/__data/assets/image/0008/736316/science-4.jpg',
    },
    {
      title: ' electronics',
      description: 'RDR 2 is a multiplayer online battle arena by Valve. The game is a sequel to Defense of the Ancients, which was a community-created mod for Blizzard Entertainment\'s Warcraft III.',
      imageUrl: 'https://brocku.ca/brock-news/wp-content/uploads/2016/02/IBM-adam-1600x1067.jpg?x94938',
    },
    {
      title: 'Computer Architecture',
      description: 'PUBG 2 is a multiplayer online battle arena by Valve. The game is a sequel to Defense of the Ancients, which was a community-created mod for Blizzard Entertainment\'s Warcraft III.',
      imageUrl: 'https://eecsnews.engin.umich.edu/wp-content/uploads/sites/2/2023/08/ISCA_featured-1024x680.png',
    },
    {
      title: 'Programming',
      description: 'Battle royale where 100 players fight to be the last person standing. which was a community-created mod for Blizzard Entertainment\'s Warcraft III.',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFiYk6JPJFpHjRihmuaUD9cb-Bei9ucnto4w&s',
    },
  ];

  const handleClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <section className="categories-section">
      <h2 className="line-title">categories</h2>
      <div className="custom-carousel reveal">
        {categories.map((categorie, index) => (
          <div
            key={index}
            className={`item ${activeIndex === index ? 'active' : ''}`}
            style={{ backgroundImage: `url(${categorie.imageUrl})` }}
            onClick={() => handleClick(index)}
          >
            <div className="item-desc">
              <h3>{categorie.title}</h3>
              <p>{categorie.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Carousel;

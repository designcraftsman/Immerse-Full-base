import React, { useState } from 'react';

const FAQComponent = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container reveal">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-item" onClick={() => toggleFAQ(0)}>
        <div className="faq-question"> <span>What is Immerse?</span> <span className='arrow'>&#9662;</span> </div>
        <div className={`faq-answer ${activeIndex === 0 ? 'active' : ''}`}>
          Immerse is an online learning community offering thousands of courses...
        </div>
      </div>
      <div className="faq-item" onClick={() => toggleFAQ(1)}>
        <div className="faq-question"><span>What is included in my Immerse subscription?</span> <span className='arrow'>&#9662;</span></div>
        <div className={`faq-answer ${activeIndex === 1 ? 'active' : ''}`}>
          Your Immerse subscription includes unlimited access to all courses...
        </div>
      </div>
      <div className="faq-item" onClick={() => toggleFAQ(2)}>
        <div className="faq-question"><span>What can I learn on Immerse?</span><span className='arrow'>&#9662;</span>  </div>
        <div className={`faq-answer ${activeIndex === 2 ? 'active' : ''}`}>
          Immerse offers courses on a variety of subjects...
        </div>
      </div>
      <div className="faq-item" onClick={() => toggleFAQ(3)}>
        <div className="faq-question"><span>What happens after my trial ends?</span><span className='arrow'>&#9662;</span> </div>
        <div className={`faq-answer ${activeIndex === 3 ? 'active' : ''}`}>
          After your trial ends, you will need to choose a paid subscription...
        </div>
      </div>
      <div className="faq-item" onClick={() => toggleFAQ(4)}>
        <div className="faq-question"><span>Can I teach on Immerse?</span> <span className='arrow'>&#9662;</span> </div>
        <div className={`faq-answer ${activeIndex === 4 ? 'active' : ''}`}>
          Yes, Immerse allows you to share your skills as an instructor...
        </div>
      </div>
    </div>
  );
};

export default FAQComponent;

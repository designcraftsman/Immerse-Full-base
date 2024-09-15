import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Quiz({ quiz }) {
  const  { idCourse } = useParams();
  const [alertMessage, setAlertMessage] = useState('');
  const [token, setToken] = useState(sessionStorage.getItem('token'));  
  const [userId, setId] = useState(sessionStorage.getItem('id'));
  const [quize, setQuiz] = useState({});
  const [quizElements, setQuizElements] = useState([]);
  const [quizElementOptions, setQuizElementOptions] = useState([]);


  useEffect(() => {
    setToken(sessionStorage.getItem('token'));
    setId(sessionStorage.getItem('id'));
  }, []);


  const getQuiz = async () => {
    try {
      const quizResponse = await fetch(`http://localhost:4200/quiz/get/${idCourse}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      let jsonData = await quizResponse.json();
      setQuiz(jsonData.quiz);
      const id = jsonData.quiz.idQuiz;

      const quizElementResponse = await fetch(`http://localhost:4200/quizElements/get/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      jsonData = await quizElementResponse.json();
      setQuizElements(jsonData.quizElements);

      const quizElementOptionsResponse = await fetch(`http://localhost:4200/quizElementOptions/get/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      jsonData = await quizElementOptionsResponse.json();
      setQuizElementOptions(jsonData.quizElementOptions);
      
      if (!quizResponse.ok) {
        throw new Error('Failed to fetch quiz');
      }

    } catch (error) {
      console.error('Error:', error);
      setQuiz([]); 
    }
  };

  useEffect(() => {
    getQuiz();
  }, [token]);

  const handleAnswerChange = (questionIndex, optionIndex, value) => {
    const updatedOptions = [...quizElementOptions];
    const relevantOptions = updatedOptions.filter(opt => opt.idQuizElement === quizElements[questionIndex].idQuizElement);

    if (relevantOptions[optionIndex]) {
      relevantOptions[optionIndex].selected = value;
    }

    setQuizElementOptions(updatedOptions);
  };

  const countCorrectAnswers = () => {
    return quizElements.reduce((correctCount, question) => {
      const options = quizElementOptions.filter(opt => opt.idQuizElement === question.idQuizElement);
      const selectedOptions = options.filter(option => option.selected);
      // Check if exactly one option is selected and it is correct
      if (selectedOptions.length === 1 && selectedOptions[0].isCorrect === true) {
        return correctCount + 1;
      }
      return correctCount;
    }, 0);
  };
  
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const correctAnswers = countCorrectAnswers();
    console.log(correctAnswers);  
      try {
        const resultData = {
          quizId: quize.idQuiz,
          result: correctAnswers
        };

        const response = await fetch(`http://localhost:4200/quizResults/add/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(resultData)
        });

        if (response.ok) {
          setAlertMessage('Quiz submitted successfully!');
        } else {
          setAlertMessage('Failed to submit quiz.');
        }
      } catch (error) {
        console.error('Error submitting quiz:', error);
        setAlertMessage('Failed to submit quiz.');
      }
  };

  const countAnsweredQuestions = () => {
    return quizElements.reduce((acc, question) => {
      const options = quizElementOptions.filter(opt => opt.idQuizElement === question.idQuizElement);
      const hasAnswered = options.some(option => option.selected);
      return acc + (hasAnswered ? 1 : 0);
    }, 0);
  };

  useEffect(() => {
    const totalQuestions = quizElements.length;
    const answeredQuestions = countAnsweredQuestions();
    const unansweredQuestions = totalQuestions - answeredQuestions;

    if (unansweredQuestions === 0) {
      setAlertMessage('All questions are answered! Ready to submit 👍🙂😊');
    } else {
      setAlertMessage(`${unansweredQuestions} more question${unansweredQuestions > 1 ? 's' : ''} to answer 😑🥱`);
    }
  }, [quizElementOptions]);

  return (
    <div className="quiz-container mt-4" id="quiz-container">
      <h2 className="quiz-title">{quize.title}</h2> <hr />
      <p className="quiz-description">{quize.description}</p>
      <p><strong>Duration to take the quiz:</strong> {quize.duration}</p>
      <p><strong>Attempts Allowed:</strong> {quize.attempts}</p>

      <form onSubmit={handleSubmit}>
        {quizElements.map((question, qIndex) => (
          <div key={qIndex} className="question-block mb-5 border-start border-secondary ps-3">
            <p className="question-text quiz-question"><strong>{qIndex + 1}. {question.question}:</strong> <hr />  </p> 
            {question.helperText && <p className="helper-text"><i>{question.helperText}</i></p>}
            <div className="options-container border-0">
              {quizElementOptions
                .filter(option => option.idQuizElement === question.idQuizElement)
                .map((option, oIndex) => (
                  <div key={oIndex} className="option-block mb-2 ms-2">
                    <input
                      role="button"
                      type={quizElementOptions.length > 2 ? 'checkbox' : 'radio'}
                      id={`question-${qIndex}-option-${oIndex}`}
                      name={`question-${qIndex}`}
                      onChange={(e) => handleAnswerChange(qIndex, oIndex, e.target.checked)}
                    />
                    <label
                      className="quiz-option ms-2"
                      role="button"
                      htmlFor={`question-${qIndex}-option-${oIndex}`}
                    >
                      {option.optionText}
                    </label>
                  </div>
                ))}
            </div>
          </div>
        ))}
        {alertMessage && (
          <div className={`alert ${alertMessage.includes('All questions are answered') ? 'alert-success' : 'alert-warning'}`} role="alert">
            {alertMessage}
          </div>
        )}
        <button
          type="submit"
          disabled={!!alertMessage && !alertMessage.includes('All questions are answered')}
          className="fs-6 custom-button3 mb-5 px-3 d-flex justify-content-center m-auto"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Quiz;

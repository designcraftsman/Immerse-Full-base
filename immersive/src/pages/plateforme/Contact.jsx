import React from 'react';

const Contact = () => {
  return (
    <div className="container mt-5 pt-5 mb-5">
      <h1 className="text-center mt-3 mb-5 fw-bold">
        Contact <span style={{ color: '#ff00ff' }}>Us</span>
      </h1>
      <hr />
      <div className="row p-5">
        <div className="col-md-6 m-auto">
          <p>
            Whether you're an educator looking to integrate cutting-edge technology into your curriculum, a student eager to explore immersive learning, or simply have questions about our platform, we're here to help. Reach out to us with any inquiries, feedback, or support needs, and our dedicated team will ensure you get the assistance you need to make the most of your learning journey with Immerse. Let's connect and take the next step in redefining education together.
          </p>
          <div className="mt-4">
            <p>
              <i className="fas fa-map-marker-alt"></i> Casablanca, Morocco Mohamed5 avenue
            </p>
            <p>
              <i className="fas fa-phone-alt"></i> +212-697326677
            </p>
          </div>
        </div>
        <div className="col-md-6 m-auto">
          <form>
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input type="text" className="form-control" id="firstName" placeholder="First Name" />
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input type="text" className="form-control" id="lastName" placeholder="Last Name" />
                </div>
              </div>
            </div>
            <div className="form-group mt-3">
              <label htmlFor="email">Email</label>
              <input type="email" className="form-control" id="email" placeholder="Email" />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="subject">Subject</label>
              <input type="text" className="form-control" id="subject" placeholder="Subject" />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="message">Message</label>
              <textarea className="form-control" id="message" rows="4" placeholder="Message"></textarea>
            </div>
            <button type="submit" className="btn btn-primary mt-4 fw-bolder text-white" style={{ backgroundColor: '#ff00ff', border: 'none' }}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;

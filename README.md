# Deepfake-detection

#  Deepfake Detection using Deep Learning

Deepfake Detection is an end-to-end AI system that detects AI-generated or manipulated media using deep learning.  
It consists of a **Backend (Flask / FastAPI)** for model inference and a **Frontend (React / Streamlit / HTML)** for user interaction.  
The model analyzes video frames and predicts whether the content is **Real** or **Fake**.


---

##  Overview

With AI-generated videos becoming increasingly realistic, deepfakes pose serious threats to media authenticity.  
This project addresses that problem by analyzing facial and temporal features in videos to detect deepfake manipulation.  

The system is divided into:
- **Frontend:** User-facing interface to upload and view detection results  
- **Backend:** API server that runs the deep learning model and returns predictions  

---

##  Features

✅ Detects fake or manipulated faces in videos and images  
✅ Real-time prediction through a clean UI  
✅ REST API for model inference  
✅ Supports both image and video formats  
✅ Trained on benchmark deepfake datasets  

---

##  Tech Stack

 Technologies 

 **Frontend** -->  React.js, HTML, CSS, JavaScript 
 **Backend** -->  Python (Flask), Flask-CORS, Werkzeug 
 **Deep Learning** -->  TensorFlow 2.8.0, Keras (ResNet50 model), h5py 
 **Libraries** -->  OpenCV, NumPy, MTCNN, SciPy, Rich 
 

---
##  Dataset

You can train and test your model using:

- [FaceForensics++](https://github.com/ondyari/FaceForensics)
- [DFDC (DeepFake Detection Challenge)](https://www.kaggle.com/c/deepfake-detection-challenge)
- Custom dataset of real and fake videos

---

##  Installation

** Install dependencies: **
pip install -r requirements.txt

 ** Backend Setup (Flask) **

**Navigate to the backend directory:
cd backend

**Start the Flask server:
python app.py

** Frontend Setup (React) **

**Navigate to the frontend directory:
cd frontend

**Install dependencies:
npm install

**Start the React app:
npm run dev


## License

This project is licensed under the MIT License.
You’re free to use and modify it with attribution.

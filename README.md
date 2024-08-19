# Crowd Analyzer

![Project Logo](path/to/logo.png)

A FastAPI-based application for crowd analysis, image description, and face recognition. This project leverages YOLO, DeepFace, and GPT-4o to analyze video feeds, describe images, and recognize faces.

## Table of Contents

- [Project Name](#project-name)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Application](#running-the-application)
  - [API Endpoints](#api-endpoints)
  - [Examples](#examples)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- **Crowd Analysis**: Analyze video feeds to detect and analyze people in crowds using YOLO and DeepFace, save the data and run analytics that benefit businesses.
- **Image Description**: Describe images using the GPT-4o model.
- **Face Recognition**: Recognize faces from images and compare them against a stored database, which enhances the security aspeect of any VMS system.
- **Database Integration**: Store and retrieve detected persons and their attributes in an SQLite database utilizing SQLAlchemy as an engine.

## Getting Started

### Prerequisites

Make sure you have Python 3.8+ installed. You'll also need to install the following packages:

- FastAPI
- SQLAlchemy
- cv2 (OpenCV)
- requests
- YOLO
- DeepFace
- CORS middleware for FastAPI
- (ALL OF THE ABOVE ARE INCLUDED IN THE REQUIREMENTS.TXT FILE)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/crowdAnalyzer/your-repo-name.git
   cd crowdAnalyzer
   ```

2. **Create and activate a virtual environment:**

   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. **Install the required packages:**

   ```bash
   pip install -r requirements.txt
   ```

### Running the Application

1. **Start the FastAPI server:**

   ```bash
   uvicorn main:app --reload
   ```

   The server will start on `http://127.0.0.1:8000`.

2. **Access the API documentation:**

   Open a browser and navigate to `http://127.0.0.1:8000/docs` to view the interactive API documentation.

## API Endpoints

This application provides several API endpoints for performing various tasks such as crowd analysis, image description, person insertion, face recognition, and retrieving matched people. These endpoints are designed to be consumed by a front-end application.

## Examples

1. **Crowd Analysis:**
   - Analyze a video and retrieve the details of detected persons.
   
2. **Describe Image:**
   - Provide a base64-encoded image and get a description using the GPT-4o model.
   
3. **Face Recognition:**
   - Upload an image, insert the person into the database, and perform face recognition.

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for details on how to contribute.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

